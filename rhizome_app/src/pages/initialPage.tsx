import { useNavigate } from "react-router";
import bg from "../assets/bg.webp";
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
                <div className="fixed bottom-4 w-full px-4 shadow-2xl">
                    <div className='flex flex-col items-center justify-center'>
                        <div className='flex w-full mb-2 gap-x-2 items-center justify-center'>
                            <Button
                                text="Criar Sala"
                                usesOn="commonGame"
                                color="darkBlue"
                                onClickButtonChildren={() => {
                                    navigate("/create-room");
                                }}
                            />
                            <Button
                                text="Entrar na Sala"
                                usesOn="commonGame"
                                color="darkBlue"
                                onClickButtonChildren={() => {
                                    
                                }}
                            />
                        </div>
                        <Button
                            text="Novo Jogo Offline"
                            usesOn="commonGame"
                            color="salmon"
                            onClickButtonChildren={() => {
                                navigate("/offline");
                            }}
                        />
                    </div>
                    
                </div>
            </div>
        </>
    );
}

export default InitialPage;
