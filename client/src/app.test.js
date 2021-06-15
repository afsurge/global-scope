import App from "./app.js";
import { render, waitFor } from "@testing-library/react";
import axios from "./axios";

jest.mock("./axios");

test("App renders correctly before and immediately after request completes when it mounts", async () => {
    axios.get.mockResolvedValue({
        data: {
            rows: [
                {
                    id: 1,
                    first: "Abrar",
                    last: "Faisal",
                    imgurl: "https://static.wikia.nocookie.net/marvel_dc/images/4/4b/Batman_Vol_3_86_Textless.jpg/revision/latest/scale-to-width-down/329?cb=20200502132734",
                    bio: "Batman Fandom",
                },
            ],
        },
    });

    const { container } = render(<App />);

    expect(container.innerHTML).toBe("");

    await waitFor(() => {
        console.log(new Date());
        expect(container.querySelector("div")).toBeTruthy();
    });

    expect(container.querySelectorAll("div").length).toBe(8);
    expect(container.querySelectorAll("div").length).toBeGreaterThanOrEqual(5);
});
