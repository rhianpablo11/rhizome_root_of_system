import { Outlet } from "react-router";
import styles from "./BaseLayout.module.css";

function BaseLayout() {
    return (
        <div
            className={
                styles.container
            }>
            <div
                className={
                    styles.containerWrapper
                }>
                <Outlet />
            </div>
        </div>
    );
}

export default BaseLayout;
