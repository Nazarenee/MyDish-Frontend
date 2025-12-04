import { StyleSheet } from "react-native";
export default StyleSheet.create({
 sidebar: {
    width: 200,
    backgroundColor: "#2c3e50",
    paddingTop: 20,
  },
  sidebarHeader: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#34495e",
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingHorizontal: 20,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  sidebarItemActive: {
    backgroundColor: "#34495e",
    borderLeftColor: "#1a8fe3",
  },
  sidebarText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  sidebarSpacer: {
    flex: 1,
  },
});