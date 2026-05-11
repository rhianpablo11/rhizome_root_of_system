import type { IShowCardsToChoice } from "../interfaces/components/IShowCardsToChoice"


function ShowCardsToChoice(props: IShowCardsToChoice){
    const {nameAdvisor, nameLider, showToLider, cardsId} = props
    
    return(
        <>
            <div className="w-full flex flex-col h-full pb-15 relative">
                <div className="w-full h-full bg-[#F6F7EF] rounded-4xl shadow-2xl">

                </div>
                <div className="fixed bottom-20 px-5 flex justify-center items-center">
                    <h1 className="text-[#1E293B] font-semibold text-2xl">
                        {showToLider ? nameLider : nameAdvisor} clique em uma carta para ver as opções
                    </h1>
                </div>
            </div>
        </>
    )
}

export default ShowCardsToChoice