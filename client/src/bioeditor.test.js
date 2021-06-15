import BioEditor from "./bioeditor";
import { render } from "@testing-library/react";
import axios from "./axios";

test("ADD button is rendered when no Bio is passed", () => {
    const { container } = render(<BioEditor />);

    expect(container.querySelector("button").innerHTML).toBe("ADD");
});

test("EDIT button is rendered when Bio is passed", () => {
    const { container } = render(<BioEditor bio="Batman Fandom" />);

    expect(container.querySelector("button").innerHTML).toBe("EDIT");
});
