import BioEditor from "./bioeditor";
import ProfilePic from "./profilepic";

export default function Profile(props) {
    return (
        <div id="profile">
            <ProfilePic
                imgUrl={props.imgUrl}
                toggleUploader={() => props.toggleUploader()}
                class1="withBio"
                class2="largeppic"
            />
            <BioEditor
                bio={props.bio}
                updateBioInApp={(bio) => props.updateBioInApp(bio)}
            />
        </div>
    );
}
