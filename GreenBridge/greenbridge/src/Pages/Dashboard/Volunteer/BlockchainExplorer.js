import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/Header';
import './BlockchainExplorer.css';

const BlockchainExplorer = () => {
    const [blockchainData, setBlockchainData] = useState(null);
    const [error, setError] = useState('');
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        fetchBlockchainData();
    }, []);

    const fetchBlockchainData = async () => {
        try {
            const response = await axios.get(
                'http://127.0.0.1:8000/api/v1/volunteer/blockchain/',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setBlockchainData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching blockchain data:', error);
            setError('Error fetching blockchain data');
            setLoading(false);
        }
    };

    const handleBlockClick = (block) => {
        setSelectedBlock(selectedBlock?.index === block.index ? null : block);
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="blockchain-explorer">
                    <h2>Loading blockchain data...</h2>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="blockchain-explorer">
                <div className="blockchain-header">
                    <h2>Volunteer Blockchain Explorer</h2>
                    {blockchainData && (
                        <div className="blockchain-info">
                            <div className="info-box">
                                <label>Total Blocks:</label>
                                <span>{blockchainData.length}</span>
                            </div>
                            <div className="info-box">
                                <label>Chain Status:</label>
                                <span className={`status ${blockchainData.is_valid ? 'valid' : 'invalid'}`}>
                                    {blockchainData.is_valid ? 'Valid' : 'Invalid'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="blockchain-visualization">
                    {blockchainData?.chain.map((block, index) => (
                        <div key={block.hash} className="block-container">
                            <div 
                                className={`block ${selectedBlock?.index === block.index ? 'selected' : ''}`}
                                onClick={() => handleBlockClick(block)}
                            >
                                <div className="block-header">
                                    <div className="block-title">
                                        <h3>Block #{block.index}</h3>
                                        <span className="timestamp">
                                            {new Date(block.timestamp * 1000).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="block-action">
                                        {block.data.action}
                                    </div>
                                </div>

                                {selectedBlock?.index === block.index && (
                                    <div className="block-details">
                                        <div className="block-field">
                                            <label>Block Hash:</label>
                                            <code>{block.hash}</code>
                                        </div>
                                        <div className="block-field">
                                            <label>Previous Block Hash:</label>
                                            <code>{block.previous_hash}</code>
                                        </div>
                                        <div className="block-field">
                                            <label>Data:</label>
                                            <pre className="data-content">
                                                {JSON.stringify(block.data, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {index < blockchainData.chain.length - 1 && (
                                <div className="block-arrow">→</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlockchainExplorer; 