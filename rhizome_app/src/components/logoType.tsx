import type { ILogoType } from "../interfaces/components/ILogoType";


function LogoType(props: ILogoType) {
    const { localOfUse } = props;
    return (
        <div className='flex flex-col items-center m-0 p-0'>
            <h1 className={`${ localOfUse == 'offlinePage' ? 'text-[80px] mt-6 leading-10' : 'text-[100px] mt-8 leading-14' } font-hand text-[#1E293B]`}>Rhizome</h1>
            <h1 className={`${ localOfUse == 'offlinePage' ? 'text-base' : 'text-lg ' } text-[#1E293B] font-light`}>A rota do sistema</h1>
        </div>
    );
}

export default LogoType;