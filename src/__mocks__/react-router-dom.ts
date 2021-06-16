import * as history from 'history';
const reactRouterDom = jest.requireActual('react-router-dom');

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { __getMockedHistoryArray } = history;

const useLocation = () => {
    const array = __getMockedHistoryArray();
    return {
        pathname: array[array.length - 1],
    };
};

const useHistory = () => __getMockedHistoryArray();

module.exports = {
    ...reactRouterDom,
    useHistory,
    useLocation,
};
