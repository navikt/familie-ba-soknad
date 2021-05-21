const reactRouterDom = jest.createMockFromModule('react-router-dom');

const mockHistoryArray: string[] = [];

const useLocation = () => ({
    pathname: mockHistoryArray[mockHistoryArray.length - 1],
});

const useHistory = () => mockHistoryArray;

const __setHistory = (history: string[]): string[] => {
    while (mockHistoryArray.length > 0) {
        mockHistoryArray.pop();
    }
    mockHistoryArray.push(...history);
    return mockHistoryArray;
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
reactRouterDom.useHistory = useHistory;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
reactRouterDom.useLocation = useLocation;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
reactRouterDom.__setHistory = __setHistory;

module.exports = reactRouterDom;
