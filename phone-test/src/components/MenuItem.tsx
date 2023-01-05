import { CallDirection } from "../constants/constants";

/**
 * MenuItem looks to be broken in '@aircall/tractor' I decide to create my own MenuItem, but we can refactor later once the component is fixed
 */
interface IMenuItem {
    setDirectionFilter: any,
    label: string,
    selected: boolean,
    value?: CallDirection
}
export const MenuItem = ({ setDirectionFilter, label, selected, value }: IMenuItem) => {

    const itemStyle = {
        cursor: 'pointer',
        display: 'flex',
        margin: '5px'
    };

    const checkStyle = {
        color: '#00B388',
        marginTop: '-2px',
        marginLeft: '5px'
    }

    return (
        <>
            <div style={itemStyle} onClick={() => { setDirectionFilter(value) }}>{label}
                {selected &&
                    <svg style={checkStyle} width="24px" height="24px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="sc-cARXMi fQvREY"><path d="M19.018 32.604 38.311 13.31c.943-.943 2.357.471 1.414 1.414l-20 20c-.328.328-.713.37-1.036.247a1.1 1.1 0 0 1-.447-.276c-.27-.297-.485-.524-.643-.683l-9.288-9.288c-.943-.943.471-2.357 1.414-1.414l9.293 9.293Z" fill="currentColor"></path></svg>
                }
            </div>
        </>
    );
};
