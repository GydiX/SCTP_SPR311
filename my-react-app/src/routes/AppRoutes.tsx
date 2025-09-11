import {Route, Routes} from "react-router-dom";
import UsersList from "../pages/users/UsersList.tsx";
import Login from "../pages/auth/Login.tsx";
import * as React from "react";
import MainLayout from "../layouts/MainLayout.tsx";
import NotFound from "../pages/NotFound.tsx";
import PlaylistsPage from "../pages/playlists/PlaylistsPage";
import PlaylistView from "../pages/playlists/PlaylistView";
import UserView from "../pages/user/UserView.tsx";
import SearchResults from "../pages/search/SearchResults.tsx";
import HomePage from "../pages/HomePage.tsx";

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout/>}>
                <Route index element={<HomePage />} />
                <Route path={"login"} element={<Login />} />
                <Route path={"playlists"}>
                    <Route index element={<PlaylistsPage />} />
                    <Route path={":id"} element={<PlaylistView />} />
                </Route>
                <Route path={"search"} element={<SearchResults />} />
                <Route path={"users"} element={<UsersList />} />
                <Route path={"user"}>
                    <Route path={":id"} element={<UserView />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
export default AppRoutes;