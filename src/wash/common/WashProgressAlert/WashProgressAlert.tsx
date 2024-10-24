import { useGetNFT } from 'src/wash/hooks/useGetNFT';
import { getPepeImage } from 'src/wash/utils/getPepeImage';
import {
  WashProgressAlertButton,
  WashProgressAlertContainer,
  WashProgressAlertContent,
  WashProgressAlertImage,
  WashProgressAlertTitle,
  WashProgressImageWrapper,
  WashProgressInfo,
} from '.';

export const WashProgressAlert = () => {
  const data = useGetNFT();

  return (
    <WashProgressAlertContainer className="alert">
      <WashProgressAlertTitle>Wash trade</WashProgressAlertTitle>
      <WashProgressAlertContent marginTop={1.5}>
        Trade on Jumper to wash your NFT and win prizes.
      </WashProgressAlertContent>
      <WashProgressAlertButton>
        {data.hasNFT ? 'Keep washing' : 'Start washing'}
      </WashProgressAlertButton>
      <WashProgressImageWrapper>
        <WashProgressInfo
          progress={data.nft?.progress || 0}
        >{`${data.nft?.progress || 0}%`}</WashProgressInfo>
        <WashProgressAlertImage
          src={`/wash/${getPepeImage(data.nft?.progress || 0, data.nft?.color ?? 'pink')}`}
          alt={'nft-image'}
          isRare={false}
          width={128}
          height={128}
        />
      </WashProgressImageWrapper>
    </WashProgressAlertContainer>
  );
};
