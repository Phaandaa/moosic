import renderer from 'react-test-renderer';
import App from './App';

jest.useFakeTimers();

describe("App", () => {
    it("has 1 child", async() => {
        const tree = renderer.create(<App />).toJSON();
        jest.runAllTimers();
        expect(tree.children.length).toBe(1);
    });
});