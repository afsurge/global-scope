// pass 'props' as arg to access info passed down from parent (App)
// destructuring to pull up properties inside props
export default function ProfilePic(props) {
    const imgUrl = props.imgUrl || "no-profile-pic.png";
    // console.log("Props in profile pic:", props);

    return (
        <div id="profilepic" className="appTop">
            <img
                className="smallppic"
                src={imgUrl}
                alt={props.last}
                onClick={props.toggleUploader}
            />
            {/* <h3>First Name: {props.first}</h3>
            <h3>Last Name: {props.last}</h3> */}
        </div>
    );
}
