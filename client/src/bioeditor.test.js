import BioEditor from "./bioeditor";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "./axios";

jest.mock("./axios");

axios.post.mockResolvedValue({
    data: {
        success: true,
    },
});

test("ADD button is rendered when no Bio is passed", () => {
    const { container } = render(<BioEditor />);

    expect(container.querySelector("button").innerHTML).toBe("ADD");
});

test("EDIT button is rendered when Bio is passed", () => {
    const { container } = render(<BioEditor bio="Dark Knight Rises" />);

    expect(container.querySelector("button").innerHTML).toBe("EDIT");
});

test("textarea and SAVE button is rendered when ADD or EDIT button is clicked", () => {
    // without bio passed
    // const { container } = render(<BioEditor />);

    // with bio passed
    const { container } = render(<BioEditor bio="Dark Knight Rises" />);

    fireEvent.click(container.querySelector("button"));

    expect(container.querySelector("textarea")).toBeTruthy();
    expect(container.querySelectorAll("button").length).toBe(2);
    expect(container.querySelectorAll("button")[1].innerHTML).toBe("SAVE"); // [1] in array of buttons is SAVE
});

test("ajax request done, page updated with new bio and updateBioInApp called on SAVE click ", async () => {
    const updateBioInApp = jest.fn();
    const { container } = render(<BioEditor updateBioInApp={updateBioInApp} />);

    // click on ADD button when no bio is passed
    fireEvent.click(container.querySelector("button"));

    fireEvent.change(container.querySelector("textarea"), {
        target: { value: "Testing bio add/update!" },
    });

    // click SAVE button, [1] index in array of buttons below
    fireEvent.click(container.querySelectorAll("button")[1]);

    await waitFor(() => {
        expect(container.querySelector("p").innerHTML).toBe(
            "Testing bio add/update!"
        );
    });

    // test updateBioInApp call after ajax request success
    expect(updateBioInApp.mock.calls.length).toBe(1);
});
