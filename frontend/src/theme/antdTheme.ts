import type { ThemeConfig } from "antd";

/**
 * Ant Design theme configuration for the CV Documents admin UI.
 * Passed to ConfigProvider in main.tsx.
 *
 * @see https://ant.design/docs/react/customize-theme
 */
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#1677ff",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1677ff",
    colorTextBase: "#141414",
    colorBgBase: "#ffffff",
    borderRadius: 6,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,
    controlHeight: 32,
  },
  components: {
    Layout: {
      headerBg: "#001529",
      headerHeight: 64,
      bodyBg: "#e3e3e3",
    },
    Menu: {
      darkItemBg: "transparent",
      darkItemSelectedBg: "#1677ff",
      darkItemColor: "rgba(255, 255, 255, 0.65)",
      darkItemHoverColor: "#ffffff",
    },
    Table: {
      headerBg: "#fafafa",
      rowHoverBg: "#f0f5ff",
    },
    Card: {
      borderRadiusLG: 8,
    },
    Button: {
      borderRadius: 6,
    },
    Tabs: {
      inkBarColor: "#1677ff",
      itemSelectedColor: "#1677ff",
    },
  },
};
