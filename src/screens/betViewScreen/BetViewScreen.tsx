import {LotView} from '../../components/LotView/LotView';
import {SpinnerWrapper} from '../../components/spinnerWrapper/spinnerWrapper';
import {FC, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BetStackParams} from '../../types/navigation';
import {ROUTES} from '../../constants/routes';
import {useGetLotQuery} from '../../api/endpoints';
import {RefreshControl, ScrollView, View} from 'react-native';
import ButtonWithIcon from '../../components/buttons/ButtonWithIcon/ButtonWithIcon';
import styles from './betViewScreenStyles';
import ShoppingIcon from '../../assets/icons/shopping.svg';
import BetIcon from '../../assets/icons/bet.svg';
import {Colors} from '../../constants/colors';
import {BetsModalContainer} from '../../components/modal/betsModal/BetsModalContainer';

type Props = NativeStackScreenProps<BetStackParams, ROUTES.BetView>;

export const BetViewScreen: FC<Props> = ({navigation, route}) => {
  const {id, position} = route.params;
  const {data: lot, isLoading, refetch: refetchLot} = useGetLotQuery(id);
  const [isModalVisible, setIsModalVisible] = useState(false);
  let minBet: number = 0;

  //TODO: move to separate function (the same in other places)
  if (lot && lot.leading) {
    if (lot.leading.amount === lot.total_price - 1) {
      minBet = lot.total_price - 1;
    } else if (lot.start_price >= lot.leading.amount) {
      minBet = lot.start_price + 1;
    } else minBet = lot.leading.amount + 1;
  }

  if (isLoading) {
    return <SpinnerWrapper />;
  }

  return (
    lot && (
      <ScrollView
        style={styles.lotScreenWrapper}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetchLot} />
        }>
        <LotView lot={lot} position={position} />
        <View style={styles.buttons}>
          <ButtonWithIcon
            title="New bet"
            type="light"
            icon={<BetIcon fill={Colors.BUTTON_PRIMARY} />}
            onPress={() => setIsModalVisible(true)}
          />
          <ButtonWithIcon
            title="Buy now"
            type="dark"
            icon={<ShoppingIcon fill={Colors.WHITE} />}
          />
        </View>
        <BetsModalContainer
          isOpen={isModalVisible}
          onClose={setIsModalVisible}
          minBet={minBet}
          maxBet={lot.total_price - 1}
          lot_id={id}
          currency={lot.currency}
        />
      </ScrollView>
    )
  );
};
