import { Badge, Tabs } from '@mantine/core';

import CallingDialogWithArgument from './examples/CallingDialogWithArgument/CallingDialogWithArgument.tsx';
import OpenGlobalDrawerOnBurgerClick from './examples/OpenGlobalDrawerOnBurgerClick/OpenGlobalDrawerOnBurgerClick.tsx';
import OrderPlacement from './examples/OrderPlacement/OrderPlacement';

const Demo = () => {
    return (
        <Tabs defaultValue="order_placement">
            <Tabs.List>
                <Tabs.Tab
                    value="order_placement"
                    leftSection={
                        <Badge size="sm" circle>
                            1
                        </Badge>
                    }
                >
                    Order placement
                </Tabs.Tab>
                <Tabs.Tab
                    value="dialog_with_args_example"
                    leftSection={
                        <Badge size="sm" circle>
                            2
                        </Badge>
                    }
                >
                    Dialog With Args Example
                </Tabs.Tab>
                <Tabs.Tab
                    value="drawer_example"
                    leftSection={
                        <Badge size="sm" circle>
                            3
                        </Badge>
                    }
                >
                    Calling the global "Drawer" when clicking on the hamburger menu
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="order_placement" pt={20}>
                <OrderPlacement />
            </Tabs.Panel>

            <Tabs.Panel value="dialog_with_args_example" pt={20}>
                <CallingDialogWithArgument />
            </Tabs.Panel>

            <Tabs.Panel value="drawer_example" pt={20}>
                <OpenGlobalDrawerOnBurgerClick />
            </Tabs.Panel>
        </Tabs>
    );
};

export default Demo;
