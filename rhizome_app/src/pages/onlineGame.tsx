import bg from "../assets/bg.webp";
import Button from "../components/button";
import GetDataOnlineRoom from "../components/getDataOnlineRoom";
import LogoType from "../components/logoType";
import ShowPlayersConected from "../components/showPlayersConecteds";

function OnlineGame() {
    return(
        <>
        <div
            className="w-full h-dvh flex flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url("${bg}")`,
            }}>
                <div className='w-full h-full flex flex-col backdrop-blur-[3px] relative'>
                    <div className='w-full'>
                        <LogoType localOfUse="offlinePage" />
                    </div>
                    <div className='px-4 w-full items-center justify-center'>
                        {/* <GetDataOnlineRoom useOn="getInRoom" /> */}
                        <ShowPlayersConected />
                    </div>
                    <div className='w-full px-10 gap-y-2 flex flex-col fixed bottom-4'>
                        <Button
                            text="Continuar"
                            usesOn="commonGame"
                            color="salmon"
                            onClickButtonChildren={() => {
                                
                            }}
                        />
                        <Button
                            text="Cancelar"
                            usesOn="commonGame"
                            color="darkBlue"
                            onClickButtonChildren={() => {
                                
                            }}
                        />
                    </div>
                </div>
        </div>
        </>
    )
}

export default OnlineGame;