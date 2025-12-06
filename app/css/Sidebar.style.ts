import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');
const isSmallScreen = width < 768;

export default StyleSheet.create({
  sidebar: {
    width: isSmallScreen ? 70 : 200,
    backgroundColor: "#2c3e50",
    paddingTop: 20,
    height: '100%',
  },
  sidebarHeader: {
    paddingHorizontal: isSmallScreen ? 8 : 20,
    paddingBottom: isSmallScreen ? 20 : 30,
    borderBottomWidth: 1,
    borderBottomColor: "#34495e",
    alignItems: 'center',
  },
  sidebarTitle: {
    fontSize: isSmallScreen ? 16 : 24,
    fontWeight: "bold",
    color: "#fff",
  },
  sidebarItem: {
    flexDirection: isSmallScreen ? "column" : "row",
    alignItems: "center",
    justifyContent: "center",
    padding: isSmallScreen ? 12 : 16,
    paddingHorizontal: isSmallScreen ? 8 : 20,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  sidebarItemActive: {
    backgroundColor: "#34495e",
    borderLeftColor: "#1a8fe3",
  },
  sidebarIcon: {
    fontSize: 20,
    marginRight: isSmallScreen ? 0 : 12,
    marginBottom: isSmallScreen ? 4 : 0,
  },
  sidebarText: {
    fontSize: isSmallScreen ? 10 : 16,
    color: "#fff",
    fontWeight: "500",
    textAlign: 'center',
  },
  sidebarSpacer: {
    flex: 1,
  },
  hamburger: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1000,
    backgroundColor: '#2c3e50',
    padding: 12,
    borderRadius: 8,
  },
  hamburgerIcon: {
    fontSize: 24,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  modalSidebar: {
    width: '80%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: -60,
    zIndex: 1001,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
});