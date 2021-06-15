import ProfilePic from "./profilepic";
import { render, fireEvent } from "@testing-library/react";
import { expect } from "@jest/globals";

test("img has correct src when passed a url", () => {
    const { container } = render(<ProfilePic imgUrl="/snowyhusky.jpg" />);

    expect(container.querySelector("img").src.endsWith("/snowyhusky.jpg")).toBe(
        true
    );
});

test("img has correct src when no url passed", () => {
    const { container } = render(<ProfilePic />);

    expect(
        container.querySelector("img").src.endsWith("no-profile-pic.png")
    ).toBe(true);
});

test("img has correct alt attribute", () => {
    const { container } = render(<ProfilePic first="Abrar" last="Faisal" />);

    expect(container.querySelector("img").alt).toBe("Faisal");
});

test("toggleUploader prop gets attached as event listener to img", () => {
    const toggleUploader = jest.fn();

    const { container } = render(
        <ProfilePic toggleUploader={toggleUploader} />
    );

    console.log(toggleUploader.mock.calls.length);

    fireEvent.click(container.querySelector("img"));
    fireEvent.click(container.querySelector("img"));
    fireEvent.click(container.querySelector("img"));

    expect(toggleUploader.mock.calls.length).toBe(3);
});
