import Greetee from "./greetee";
import Counter from "./counter";

export default function HelloWorld() {
    const firstName = "Abrar";
    return (
        <div className="spiced">
            <div>
                Hello <Greetee name={firstName} />
            </div>
            <div>
                Hello <Greetee name="Fennel" />
            </div>
            <div>
                Hello <Greetee />
            </div>
            <Counter />
        </div>
    );
}
