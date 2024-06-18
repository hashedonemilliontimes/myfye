import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import bankIcon from '../assets/bankIcon.png'
import LoadingAnimation from '../components/loadingAnimation';

function PayTransactions() {
    const publicKey = useSelector((state: any) => state.userWalletData.pubKey);
    const db = getFirestore();
    const [transactions, setTransactions] = useState<Transaction[]>([]); // Use the Transaction type here
    const [transactionsLoaded, setTransactionsLoaded] = useState(false);
    const userEmail = useSelector((state: any) => state.userWalletData.currentUserEmail);

    interface Transaction {
        id: string;
        type: string;
        time: string; // Adjust based on your actual timestamp object structure
        amount: number;
        publicKey: string;
        currency: string;
        receiverEmail: string;
        senderEmail: string;
    }

    useEffect(() => {
        const fetchTransactions = async () => {
            const payTransactionsRef = collection(db, 'payTransactions');
            try {
                const querySnapshot = await getDocs(payTransactionsRef);
                const items = querySnapshot.docs.map(doc => ({
                    ...doc.data() as Transaction, // Type assertion here
                    id: doc.id,
                }));
                const filteredItems = items.filter(item => 
                    item.receiverEmail === userEmail || item.senderEmail === userEmail
                );
    
                filteredItems.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    
                // If you have a state to set the filtered items
                setTransactions(filteredItems);

                setTransactionsLoaded(true);
            } catch (error) {
                console.error("Error fetching transactions: ", error);
            }
        };

        if (userEmail) {
            fetchTransactions();
        }
    }, [userEmail]);

    return (
        <div>
            {!transactionsLoaded ? (
<div>
    <LoadingAnimation/>
</div>

            ) : (
                <div>
                {transactions.length == 0 ? (
                    <div>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                        <img src={bankIcon} style={{marginTop: '100px', width: '200px', height: 'auto'}}/>
                        <div style={{fontSize: '20px', marginTop: '30px', color: '#777777'}}>No Transactions Yet</div>
                        </div>
    
    
                    </div>
                ) : (
                    <div>
                {transactions.map((transaction) => (

                    
                    <div key={transaction.id} style={{ paddingTop: '20px' }}>
    <div style={{display: 'flex', alignItems: 'center', justifyContent:'center'}}>
    <hr style={{height: '1px', backgroundColor: '#999999', border: 'none', width: '85vw', 
maxWidth: '550px', marginTop: '-10px'}}></hr>
</div>

                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <div style={{width: '140px'}}>
                            {transaction.receiverEmail == userEmail ? (
                                <div style={{color: '#007E0D'}}>Received</div>
                            ) : (
                                <div style={{color: '#7E0000'}}>Sent</div>
                            )}
                        </div>
                        <div style={{width: '140px', fontWeight: 'bold'}}>
                            ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>

                        <div style={{marginLeft: '70px'}}>
                        {transaction.receiverEmail == userEmail ? (
                                <div style={{color: '#000000'}}>{transaction.senderEmail}</div>
                            ) : (
                                <div style={{color: '#000000'}}>{transaction.receiverEmail}</div>
                            )}
                        </div>

                        
                        </div>

                        <div style={{whiteSpace: 'nowrap', 
                            textAlign: 'right', 
                            fontSize: '14px', 
                            marginRight: window.innerWidth > 420 ? ('350px') : ('0px')}}
                            >{new Date(transaction.time).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>


                    </div>
                ))}
    
                    </div>
                )}
    
            </div>
            )}

        </div>
    );
}

export default PayTransactions;