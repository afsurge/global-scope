import BioEditor from "./bioeditor";
import { render, fireEvent } from "@testing-library/react";
import axios from "./axios";

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
    expect(container.querySelectorAll("button")[1].innerHTML).toBe("SAVE");
});
