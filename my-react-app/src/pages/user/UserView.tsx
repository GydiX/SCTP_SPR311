import {useParams} from "react-router-dom";

const UserView = () => {
    const { id } =  useParams<{id: string}>();
    return (
        <>
            <h1>Користувач {id}</h1>
        </>
    )
}

export default UserView;