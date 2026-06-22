import type IVotingInfo from "../interfaces/components/IVotingInfo";

function VotingInfo(props: IVotingInfo) {
    const { playersToVote } = props;

    return (
        <>
            <div className="w-full flex flex-col items-center mt-2 py-2 justify-center bg-[#F6F7EF] rounded-2xl shadow-2xs">
                <h1 className="text-[#1e293b] font-medium text-xl leading-5">
                    Faltam {playersToVote} jogadores votarem
                </h1>
                <h1 className="text-[#1e293b] font-light text-base">01:00 para a votação encerrar</h1>
            </div>
        </>
    );
}

export default VotingInfo;
