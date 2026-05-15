import { useNavigate } from "react-router";
import bg from "../assets/bg.png";
import Button from "../components/button";
import LogoType from "../components/logoType";

function InitialPage() {
    const navigate = useNavigate();

    return (
        <>
            <div
                className="w-full h-dvh flex flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url("${bg}")`,
                }}>
                <LogoType localOfUse="mainMenu" />
                <div className="fixed bottom-4 w-full px-6 shadow-2xl">
                    <Button
                        text="Novo Jogo"
                        usesOn="commonGame"
                        color="salmon"
                        onClickButtonChildren={() => {
                            navigate("/offline");
                        }}
                    />
                </div>
            </div>
        </>
    );
}

export default InitialPage;
