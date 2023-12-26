import React, { useEffect, useState } from 'react';
import './discount.scss'
const Discount: React.FC<NumericKeypadProps> = ({ discount }) => {
    const [enteredValue, setEnteredValue] = useState('');
    const [totalValue, setTotalValue] = useState(0);
    const [discountType, setDiscountType] = useState('count');

    const handleButtonClick = (value: number) => {
        setEnteredValue(enteredValue + value);
        calculateTotal(enteredValue + value);
    };

    const handleDecimalButtonClick = () => {
        if (!enteredValue.includes('.')) {
            setEnteredValue(enteredValue + '.');
        }
    };

    const handleDeleteButtonClick = () => {
        setEnteredValue(enteredValue.slice(0, -1));
        calculateTotal(enteredValue.slice(0, -1));
    };

    const calculateTotal = (value: string) => {
        const enteredNumber = parseFloat(value);
        if (!isNaN(enteredNumber)) {
            setTotalValue(enteredNumber);
        }
        else { setTotalValue(0); setEnteredValue(''); }

    };
    const typeButtonClick = (value: number) => {
        if (value === 1) {
            setDiscountType('count')
        } else {
            (setDiscountType('percent'))

        }
    }
    useEffect(() => {
        discount({ count: totalValue, type: discountType })

    }, [totalValue, discountType, discount])
    return (
        <div className='discount-contant'>
            <div className='pay-headers'><b>İndirim Uygula</b></div>
            <div className='discount-type'>
                <button onClick={() => typeButtonClick(2)} className={discountType === 'percent' ? 'discount-btn active' : 'discount-btn'}>Yüzde</button>
                <button onClick={() => typeButtonClick(1)} className={discountType === 'count' ? 'discount-btn active' : 'discount-btn'}>Tutar</button></div>
            {discountType === 'count' ?
                <span className='discount-total'>Uygulanacak indirim: {totalValue.toFixed(2)}</span> :
                <span className='discount-total'>Uygulanacak indirim: %{totalValue.toFixed(2)}</span>
            }
            <div className="numeric-pad">
                {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((number) => (
                    <button className='numeric-btn' key={number} onClick={() => handleButtonClick(number)}>
                        {number}
                    </button>
                ))}
                <button className='numeric-btn' onClick={handleDecimalButtonClick}><b>,</b></button>
                <button className='numeric-btn' onClick={() => handleButtonClick(0)}>0</button>
                <button className='numeric-btn' onClick={handleDeleteButtonClick}>DEL</button>

            </div>
        </div>
    );
};
interface NumericKeypadProps {
    discount: any
}

export default Discount;
