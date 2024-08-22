import { IconArrowBigRightLine, IconArrowRight, IconCreditCard, IconHandClick, IconInfoCircle, IconPlus } from '@tabler/icons-react';
import { useEffect } from 'react';

import { Alert, Box, Button, Checkbox, Container, Divider, Flex, Grid, Group, Modal, Switch, Text, TextInput, Title } from '@mantine/core';
import { clsx } from 'clsx';
import { WatchController, globalBooleanActions } from 'use-global-boolean';

import styles from './OrderPlacement.module.css';
import { MOCK_DATA } from './mock-data.ts';

const cn = clsx;

const currencyFormatter = new Intl.NumberFormat('uk', { style: 'currency', currency: 'UAH', maximumSignificantDigits: 3 });

const OrderPlacement = () => {
    useEffect(() => {
        globalBooleanActions.setTrue('delivery-type-selector_global_PICKUP');
    }, []);

    return (
        <Container pt={50} maw="80vw">
            <Grid>
                <Grid.Col span={6}>
                    <Box className={styles.box_base}>
                        <Flex direction="row" gap="sm" mb="md">
                            <WatchController name="delivery-type-selector_global_PICKUP">
                                {(props) => {
                                    const [checked, { setTrue }] = props.localState;

                                    return (
                                        <div
                                            className={cn(styles.box__delivery_type_selector_global, {
                                                [styles.box__active]: checked,
                                                [styles.box__not_active]: !checked,
                                            })}
                                            onClick={() => {
                                                setTrue();
                                                props.globalMethods.setFalse('delivery-type-selector_global_COURIER');
                                            }}
                                        >
                                            <div className={styles.inner}>
                                                <Title size={13}>Пункт выдачи</Title>

                                                <Flex justify="space-between">
                                                    <Text className={styles.text}>{MOCK_DATA.pickup.text}</Text>

                                                    <Checkbox checked={checked} variant="outline" radius="xl" size="md" />
                                                </Flex>
                                            </div>
                                        </div>
                                    );
                                }}
                            </WatchController>
                            <WatchController name="delivery-type-selector_global_COURIER">
                                {(props) => {
                                    const [checked, { setTrue }] = props.localState;

                                    return (
                                        <Box
                                            className={cn(styles.box__delivery_type_selector_global, {
                                                [styles.box__active]: checked,
                                                [styles.box__not_active]: !checked,
                                            })}
                                            onClick={() => {
                                                setTrue();
                                                props.globalMethods.setFalse('delivery-type-selector_global_PICKUP');
                                            }}
                                        >
                                            <div className={styles.inner}>
                                                <div>
                                                    <Title className={styles.title_xs}>Курьер</Title>
                                                    {!checked && <Text className={styles.courier_subtitle}>По клику за 15-30 минут</Text>}
                                                </div>

                                                <Flex justify="space-between">
                                                    <Text className={styles.text}>{MOCK_DATA.courier.text}</Text>

                                                    <Checkbox checked={checked} onChange={() => {}} variant="outline" radius="xl" size="md" />
                                                </Flex>
                                            </div>
                                        </Box>
                                    );
                                }}
                            </WatchController>

                            <Box>
                                <WatchController>
                                    {(props) => {
                                        return (
                                            <>
                                                <TextInput
                                                    placeholder="Адрес"
                                                    size="xs"
                                                    label="Адрес"
                                                    rightSection={<IconArrowBigRightLine />}
                                                    onClick={() => props.globalMethods.setTrue('deliveryRecipient')}
                                                />
                                            </>
                                        );
                                    }}
                                </WatchController>

                                <WatchController>
                                    {(props) => {
                                        return (
                                            <>
                                                <TextInput
                                                    placeholder="Получатель"
                                                    size="xs"
                                                    label="Получатель"
                                                    rightSection={<IconArrowBigRightLine />}
                                                    onClick={() => props.globalMethods.setTrue('deliveryPointSelector')}
                                                />
                                            </>
                                        );
                                    }}
                                </WatchController>
                            </Box>
                        </Flex>

                        <WatchController>
                            {(props) => {
                                const [isCourier] = props.globalMethods.watchBoolean('delivery-type-selector_global_COURIER', false);
                                const [, deliveryTimeIntervalIndex] = props.globalMethods.watchBoolean<number>('deliveryTimeIntervals');
                                const [, deliveryDateInterval] = props.globalMethods.watchBoolean<
                                    (typeof MOCK_DATA.courier.deliveryDateIntervals)[number] | null
                                >('deliveryDateIntervals');

                                const deliveryTimeInterval = deliveryDateInterval?.deliveryTimeIntervals[deliveryTimeIntervalIndex];

                                const show =
                                    isCourier &&
                                    deliveryDateInterval !== MOCK_DATA.courier.deliveryDateIntervals[0] &&
                                    deliveryTimeInterval &&
                                    !deliveryTimeInterval.onDemand;

                                return (
                                    show && (
                                        <Alert
                                            onClick={() => {
                                                props.globalMethods.setData('deliveryDateIntervals', MOCK_DATA.courier.deliveryDateIntervals[0]);
                                                props.globalMethods.setData('deliveryTimeIntervals', 0);
                                            }}
                                            className={styles.delivery_notification}
                                            variant="light"
                                            title={MOCK_DATA.courier.deliveryNotification}
                                            icon={<IconInfoCircle />}
                                        />
                                    )
                                );
                            }}
                        </WatchController>
                    </Box>

                    <Box className={styles.box_base}>
                        <WatchController>
                            {(props) => {
                                const initialDeliveryDateIntervals = MOCK_DATA.courier.deliveryDateIntervals[0];
                                const [isCourier] = props.globalMethods.watchBoolean('delivery-type-selector_global_COURIER', false);

                                return (
                                    <>
                                        <WatchController>
                                            {(props) => {
                                                const [, deliveryDateInterval] = props.globalMethods.watchBoolean<
                                                    (typeof MOCK_DATA.courier.deliveryDateIntervals)[number] | null
                                                >('deliveryDateIntervals');

                                                const [, deliveryTimeIntervalIndex] =
                                                    props.globalMethods.watchBoolean<number>('deliveryTimeIntervals');

                                                const deliveryTimeInterval = deliveryDateInterval?.deliveryTimeIntervals[deliveryTimeIntervalIndex];

                                                const priceFrom = deliveryDateInterval?.priceFrom || deliveryTimeInterval?.priceFrom || 0;

                                                const title =
                                                    isCourier &&
                                                    deliveryDateInterval &&
                                                    deliveryTimeInterval &&
                                                    `${deliveryDateInterval.deliveryDateTimeLong}, ${deliveryTimeInterval.deliveryTimeIntervalLong}`;

                                                return (
                                                    <>
                                                        <Title className={styles.title_xl}>
                                                            {isCourier ? title : MOCK_DATA.pickup.deliveryDateTime}
                                                        </Title>
                                                        <Text className={styles.text}>
                                                            {isCourier
                                                                ? `Курьер • ${MOCK_DATA.weight} кг • ${currencyFormatter.format(priceFrom)}`
                                                                : `Пункт выдачи • ${MOCK_DATA.weight} кг • ${currencyFormatter.format(0)}`}
                                                        </Text>
                                                    </>
                                                );
                                            }}
                                        </WatchController>
                                        {isCourier && (
                                            <>
                                                <WatchController name="deliveryDateIntervals" initialData={initialDeliveryDateIntervals}>
                                                    {(props) => {
                                                        const [, { setData, data }] = props.localState;

                                                        return (
                                                            <div
                                                                ref={(ref) => {
                                                                    if (ref && data === MOCK_DATA.courier.deliveryDateIntervals[0]) {
                                                                        ref.scrollTo({
                                                                            left: 0,
                                                                            behavior: 'smooth',
                                                                        });
                                                                    }
                                                                }}
                                                                className={styles.delivery_date_intervals}
                                                            >
                                                                {MOCK_DATA.courier.deliveryDateIntervals.map((deliveryDateInterval, idx) => (
                                                                    <Box
                                                                        key={idx}
                                                                        className={cn(styles.box, {
                                                                            [styles.box__active]: data === deliveryDateInterval,
                                                                            [styles.box__not_active]: data !== deliveryDateInterval,
                                                                        })}
                                                                        onClick={() => {
                                                                            setData(deliveryDateInterval);
                                                                            props.globalMethods.setTrue('deliveryTimeIntervals', 0);
                                                                        }}
                                                                    >
                                                                        <Text className={styles.time}>
                                                                            {deliveryDateInterval.deliveryDateTimeShort}
                                                                        </Text>
                                                                        <Text className={styles.priceFrom}>
                                                                            от {currencyFormatter.format(deliveryDateInterval.priceFrom)}
                                                                        </Text>
                                                                    </Box>
                                                                ))}
                                                            </div>
                                                        );
                                                    }}
                                                </WatchController>
                                                <WatchController name="deliveryTimeIntervals" initialData={0}>
                                                    {(props) => {
                                                        const [, { setData, data }] = props.localState;

                                                        const [, deliveryDateInterval] =
                                                            props.globalMethods.watchBoolean<
                                                                (typeof MOCK_DATA.courier.deliveryDateIntervals)[number]
                                                            >('deliveryDateIntervals');

                                                        return (
                                                            <Flex
                                                                ref={(ref) => {
                                                                    if (ref && data === 0) {
                                                                        ref.scrollTo({
                                                                            left: 0,
                                                                            behavior: 'smooth',
                                                                        });
                                                                    }
                                                                }}
                                                                className={styles.delivery_time_intervals}
                                                            >
                                                                {deliveryDateInterval?.deliveryTimeIntervals.map((deliveryTimeInterval, idx) => {
                                                                    const onClick = () => setData(idx);

                                                                    const active = data === idx;

                                                                    const baseClassNames = cn(styles.box, {
                                                                        [styles.box__active]: active,
                                                                        [styles.box__not_active]: data !== idx,
                                                                    });

                                                                    if (deliveryTimeInterval.onDemand) {
                                                                        return (
                                                                            <div
                                                                                key={idx}
                                                                                className={cn(baseClassNames, styles.box_on_demand)}
                                                                                onClick={() => {
                                                                                    onClick();

                                                                                    if (active) {
                                                                                        props.globalMethods.setTrue('quickDelivery');
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <div className={styles.inner}>
                                                                                    <IconHandClick />
                                                                                    <div>
                                                                                        <Text className={styles.time}>
                                                                                            {deliveryTimeInterval.title}
                                                                                        </Text>
                                                                                        <Text className={styles.text}>
                                                                                            {deliveryTimeInterval.text}{' '}
                                                                                            {currencyFormatter.format(deliveryTimeInterval.priceFrom)}
                                                                                        </Text>
                                                                                    </div>
                                                                                    <IconInfoCircle
                                                                                        onClick={(event) => {
                                                                                            event.stopPropagation();
                                                                                            props.globalMethods.setTrue('quickDelivery');
                                                                                        }}
                                                                                        className={styles.icon}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }

                                                                    return (
                                                                        <div key={idx} className={baseClassNames} onClick={onClick}>
                                                                            <Text className={styles.time}>
                                                                                {deliveryTimeInterval.deliveryTimeInterval}
                                                                            </Text>
                                                                            <Text className={styles.text}>
                                                                                от {currencyFormatter.format(deliveryTimeInterval.priceFrom)}
                                                                            </Text>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </Flex>
                                                        );
                                                    }}
                                                </WatchController>

                                                <Flex direction="row" gap="md" pt="lg">
                                                    <WatchController name="leaveItAtDoorButton">
                                                        {(props) => {
                                                            const [checked, { toggle }] = props.localState;

                                                            return (
                                                                <Switch
                                                                    checked={checked}
                                                                    onChange={() => toggle()}
                                                                    color="yellow"
                                                                    label="Оставить у двери"
                                                                    size="sm"
                                                                />
                                                            );
                                                        }}
                                                    </WatchController>
                                                    <WatchController name="dontCallButton">
                                                        {(props) => {
                                                            const [checked, { toggle }] = props.localState;

                                                            return (
                                                                <Switch
                                                                    checked={checked}
                                                                    onChange={() => toggle()}
                                                                    color="yellow"
                                                                    label="Не звонить"
                                                                    size="sm"
                                                                />
                                                            );
                                                        }}
                                                    </WatchController>
                                                </Flex>
                                            </>
                                        )}
                                    </>
                                );
                            }}
                        </WatchController>
                    </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                    <div>
                        <div className={styles.checkout_summary_box}>
                            <Title className={styles.title_sm}>Онлайн</Title>
                            <Text className={styles.title_xl_1}>
                                <WatchController>
                                    {(props) => {
                                        const [, deliveryDateInterval] = props.globalMethods.watchBoolean<
                                            (typeof MOCK_DATA.courier.deliveryDateIntervals)[number] | null
                                        >('deliveryDateIntervals');

                                        const [, deliveryTimeIntervalIndex] = props.globalMethods.watchBoolean<number>('deliveryTimeIntervals');

                                        const deliveryTimeInterval = deliveryDateInterval?.deliveryTimeIntervals[deliveryTimeIntervalIndex];

                                        const priceFrom = deliveryDateInterval?.priceFrom || deliveryTimeInterval?.priceFrom || 0;

                                        return currencyFormatter.format(MOCK_DATA.price + priceFrom);
                                    }}
                                </WatchController>
                            </Text>
                        </div>
                        <div className={styles.payment_methods}>
                            <Title className={styles.title_sm} mb="sm">
                                Способ оплаты
                            </Title>
                            <WatchController>
                                {(props) => {
                                    return (
                                        <Text className={styles.text} onClick={() => props.globalMethods.setTrue('popupAllPaymentMethods')}>
                                            Все способы
                                        </Text>
                                    );
                                }}
                            </WatchController>
                        </div>

                        <WatchController>
                            {(props) => {
                                const [active, { toggle }] = props.localState;

                                return (
                                    <div
                                        className={cn(styles.payment_methods, styles.add_card, {
                                            [styles.box__active]: active,
                                            [styles.box__not_active]: !active,
                                        })}
                                        onMouseLeave={() => toggle()}
                                        onMouseEnter={() => toggle()}
                                        onClick={() => {
                                            props.globalMethods.setTrue('paymentMethod');
                                        }}
                                    >
                                        <IconPlus />
                                        <Text className={styles.text}>Добавить карту</Text>
                                    </div>
                                );
                            }}
                        </WatchController>
                        <WatchController>
                            {(props) => {
                                return (
                                    <div className={styles.bank_widget} onClick={() => props.globalMethods.setTrue('createBankAccount')}>
                                        <div>
                                            <Title className={styles.title_xs}>Получите скидку {currencyFormatter.format(180)}</Title>
                                            <Text className={styles.title_xs}>При оплате картой</Text>
                                        </div>
                                        <IconArrowRight />
                                    </div>
                                );
                            }}
                        </WatchController>

                        <WatchController>
                            {(props) => {
                                return (
                                    <Button
                                        leftSection={<IconCreditCard />}
                                        fullWidth
                                        h={50}
                                        onClick={() => {
                                            props.globalMethods.setTrue('paymentMethod');
                                        }}
                                    >
                                        Добавить карту
                                    </Button>
                                );
                            }}
                        </WatchController>
                    </div>
                </Grid.Col>
            </Grid>

            <WatchController name="createBankAccount">
                {(props) => {
                    const [opened, { toggle }] = props.localState;

                    return (
                        <Modal opened={opened} onClose={toggle} title="До 30% кешбэка баллами Плюса с картой Пэй" centered>
                            <Button fullWidth onClick={toggle}>
                                Открыть карту
                            </Button>
                        </Modal>
                    );
                }}
            </WatchController>

            <WatchController name="paymentMethod">
                {(props) => {
                    const [opened, { toggle }] = props.localState;

                    return (
                        <Modal opened={opened} onClose={toggle} title="Привязка новой карты" centered>
                            <Grid mb="xl">
                                <Grid.Col span={12}>
                                    <TextInput placeholder="Номер карты" size="xs" label="Номер карты" />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <TextInput placeholder="Срок действия" size="xs" label="Срок действия" />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <TextInput placeholder="Код" size="xs" label="Код" />
                                </Grid.Col>
                            </Grid>

                            <Group justify="flex-end">
                                <Button variant="default" onClick={toggle}>
                                    Отмена
                                </Button>
                                <Button variant="filled" onClick={toggle}>
                                    Привязать
                                </Button>
                            </Group>
                        </Modal>
                    );
                }}
            </WatchController>

            <WatchController name="popupAllPaymentMethods">
                {(props) => {
                    const [opened, { toggle }] = props.localState;

                    return (
                        <Modal opened={opened} onClose={toggle} title="Способ оплаты" centered>
                            <Button fullWidth onClick={toggle}>
                                Выбрать
                            </Button>
                        </Modal>
                    );
                }}
            </WatchController>

            <WatchController name="deliveryRecipient">
                {(props) => {
                    const [show, { toggle }] = props.localState;

                    return (
                        <Modal opened={show} onClose={toggle} title="Адреса доставки" centered>
                            <Button onClick={toggle} fullWidth>
                                Добавить адрес
                            </Button>
                        </Modal>
                    );
                }}
            </WatchController>

            <WatchController name="deliveryPointSelector">
                {(props) => {
                    const [show, { toggle }] = props.localState;

                    return (
                        <Modal opened={show} onClose={toggle} title="Получатель" centered>
                            <Button onClick={toggle} fullWidth>
                                Выбрать
                            </Button>
                        </Modal>
                    );
                }}
            </WatchController>

            <WatchController name="quickDelivery">
                {(props) => {
                    const [show, { toggle }] = props.localState;

                    return (
                        <Modal opened={show} onClose={toggle} title="Удобнее, чем идти в пункт выдачи или ждать курьера" centered>
                            <Text className={styles.title_xs}>В день доставки напишем, что можно вызвать курьера — на это будет 3 дня</Text>
                            <Divider my="xs" />
                            <Text className={styles.title_xs}>Нажмите кнопку, и курьер приедет в течение 15—30 минут</Text>
                            <Divider my="xs" />
                            <Text className={styles.title_xs} mb="md">
                                Можно добавить любимые продукты из Лавки — привезем вместе с заказом
                            </Text>

                            <Button onClick={toggle} fullWidth variant="light">
                                Звучит здорово
                            </Button>
                        </Modal>
                    );
                }}
            </WatchController>
        </Container>
    );
};

export default OrderPlacement;
