import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
} from '@mantine/core';
import React from "react";
import { useState } from 'react';


function Navb() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div>
      <AppShell>
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          <Text>Application navbar</Text>
        </Navbar>
      }
      </AppShell>
    </div>
  );
}

export default Navb;
