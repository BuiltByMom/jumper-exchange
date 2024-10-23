import { createContext, useContext, useEffect } from 'react';
import { useGetCollection } from '../hooks/useGetCollection';
import { type TGetUser, useGetUser } from '../hooks/useGetUser';
import { type TGetNFT, useGetNFT } from '../hooks/useGetNFT';
import { type TUseMint, useMint } from '../hooks/useMint';
import { useReveal } from '../hooks/useReveal';
import { type TUseWash, useWash } from '../hooks/useWash';
import { useWidgetEvents, WidgetEvent } from '@lifi/widget';

import type { ReactElement } from 'react';
import type { TGetCollection } from '../hooks/useGetCollection';
import type { TRevealHook } from '../hooks/useReveal';
import type { Route } from '@lifi/widget';

type TWashTradingContext = {
  nft: TGetNFT;
  mint: TUseMint;
  reveal: TRevealHook;
  wash: TUseWash;
  user: TGetUser;
  collection: TGetCollection;
};

const WashTradingContext = createContext<TWashTradingContext>({
  nft: {
    isLoading: false,
    hasNFT: false,
    error: null,
    refetch: undefined,
  },
  mint: {
    onMint: () => {},
    mintStatus: '',
    isMinting: false,
    error: undefined,
  },
  reveal: {
    onReveal: () => {},
    isRevealing: false,
    hasCanceledReveal: false,
    error: undefined,
    revealStatus: '',
  },
  wash: {
    onWash: async () => {},
    isWashing: false,
    error: '',
    washStatus: '',
  },
  user: {
    isLoading: false,
    items: undefined,
    quests: undefined,
    error: undefined,
    refetch: undefined,
  },
  collection: {
    collection: undefined,
    isLoading: false,
    error: null,
    refetch: undefined,
    hasCollection: false,
  },
});
export function WashTradingContextApp(props: {
  children: ReactElement;
}): ReactElement {
  const nft = useGetNFT();
  const user = useGetUser();
  const wash = useWash(user.refetch, nft.refetch);
  const mint = useMint(nft.refetch);
  const reveal = useReveal(nft.refetch);
  const collection = useGetCollection();
  const widgetEvents = useWidgetEvents();

  useEffect(() => {
    const onRouteExecutionCompleted = (route: Route): void => {
      fetch('/api/wash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: route.id,
          fromAddress: route.fromAddress,
          fromAmount: route.fromAmount,
          fromAmountUSD: route.fromAmountUSD,
          fromChainID: route.fromChainId,
          toAddress: route.toAddress,
          toAmount: route.toAmount,
          toAmountUSD: route.toAmountUSD,
          toChainID: route.toChainId,
        }),
      });
    };

    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted,
    );

    return () => widgetEvents.all.clear();
  }, [widgetEvents]);

  return (
    <WashTradingContext.Provider
      value={{ reveal, user, nft, wash, mint, collection }}
    >
      {props.children}
    </WashTradingContext.Provider>
  );
}

export const useWashTrading = (): TWashTradingContext =>
  useContext(WashTradingContext);
