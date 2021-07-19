// pass 'props' as arg to access info passed down from parent (App)
// destructuring to pull up properties inside props
export default function ProfilePic(props) {
    const imgUrl = props.imgUrl || "no-profile-pic.png";
    // console.log("Props in profile pic:", props);

    return (
        <div id="profilepic" className={props.class1}>
            <img
                className={props.class2}
                src={imgUrl}
                alt={props.last}
                onClick={props.toggleUploader}
            />
        </div>
    );
}
