export default function Greetee(props) {
    console.log("props in greetee:", props);
    return <span>{props.name || "FENNEL FRIENDS"}</span>;
}
