import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLink, FaHistory, FaInfoCircle, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import './BlockchainExplorer.css';

const BlockchainExplorer = () => {
    const [blockchainData, setBlockchainData] = useState(null);
    const [error, setError] = useState('');
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('chain');
    const [hashDemo, setHashDemo] = useState({ active: false, originalData: null, modifiedData: null });
    const [newBlock, setNewBlock] = useState(null);
    
    // Block creation tracking
    const [processingBlock, setProcessingBlock] = useState(false);
    const [blockCreationStatus, setBlockCreationStatus] = useState(null);
    const [performanceHistory, setPerformanceHistory] = useState([]);
    const [showPerformance, setShowPerformance] = useState(false);
    
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        fetchBlockchainData();
    }, []);

    useEffect(() => {
        // Pre-populate with sample data for demonstration
        if (performanceHistory.length === 0) {
            setPerformanceHistory([
                {
                    blockIndex: 1,
                    calculationTime: 125.45,
                    timestamp: "10:15:22 AM"
                },
                {
                    blockIndex: 2,
                    calculationTime: 98.32,
                    timestamp: "10:18:44 AM"
                },
                {
                    blockIndex: 3,
                    calculationTime: 143.67,
                    timestamp: "10:22:15 AM"
                }
            ]);
        }
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

    const showHashDemo = (block) => {
        setHashDemo({
            active: true,
            originalData: block.data,
            originalHash: block.hash,
            modifiedData: JSON.parse(JSON.stringify(block.data)),
            block: block
        });
    };

    const updateHashDemoData = (key, value) => {
        if (!hashDemo.active) return;
        
        const updatedData = {...hashDemo.modifiedData};
        updatedData[key] = value;
        
        setHashDemo({
            ...hashDemo,
            modifiedData: updatedData,
            modifiedHash: simulateHash(updatedData)
        });
    };

    // Simple hash simulator
    const simulateHash = (data) => {
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(64, '0');
    };

    // Modified simulateNewBlock function with timing
    const simulateNewBlock = () => {
        setProcessingBlock(true);
        const startTime = performance.now();
        
        setBlockCreationStatus({
            status: 'processing',
            message: 'Calculating block hash...',
            progress: 0
        });
        
        // Simulate progress updates
        const progressInterval = setInterval(() => {
            setBlockCreationStatus(prev => ({
                ...prev,
                progress: Math.min((prev?.progress || 0) + 10, 95)
            }));
        }, 200);
        
        // Simulate blockchain processing
        setTimeout(() => {
            clearInterval(progressInterval);
            
            if (!blockchainData?.chain || blockchainData.chain.length === 0) return;
            
            const lastBlock = blockchainData.chain[blockchainData.chain.length - 1];
            const newBlockData = {
                index: lastBlock.index + 1,
                timestamp: Date.now() / 1000,
                data: {
                    action: "donation_made",
                    record_type: "donation",
                    amount: 150.00,
                    donation_type: "one-time",
                    purpose: "education",
                    user_id: 1001
                },
                previous_hash: lastBlock.hash,
                hash: "0".repeat(64) // Will be calculated
            };
            
            // Simulate hash calculation
            const blockString = JSON.stringify(newBlockData);
            let hash = 0;
            for (let i = 0; i < blockString.length; i++) {
                const char = blockString.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            newBlockData.hash = Math.abs(hash).toString(16).padStart(64, '0');
            
            const endTime = performance.now();
            const calculationTime = (endTime - startTime).toFixed(2);
            
            setBlockCreationStatus({
                status: 'complete',
                message: `Block #${newBlockData.index} created successfully!`,
                hash: newBlockData.hash,
                calculationTime: calculationTime,
                progress: 100
            });
            
            setNewBlock(newBlockData);
            
            // Add to performance history
            const newPerformanceData = {
                blockIndex: newBlockData.index,
                calculationTime: parseFloat(calculationTime),
                timestamp: new Date().toLocaleTimeString()
            };
            
            setPerformanceHistory(prev => [...prev, newPerformanceData]);
            
            // Simulate adding block to chain
            setTimeout(() => {
                setBlockchainData({
                    ...blockchainData,
                    chain: [...blockchainData.chain, newBlockData]
                });
                setNewBlock(null);
                setProcessingBlock(false);
            }, 3000);
        }, 2000);
    };

    // Calculate performance stats
    const getAverageTime = () => {
        if (performanceHistory.length === 0) return 0;
        const sum = performanceHistory.reduce((acc, item) => acc + item.calculationTime, 0);
        return (sum / performanceHistory.length).toFixed(2);
    };

    const getFastestTime = () => {
        if (performanceHistory.length === 0) return 0;
        return Math.min(...performanceHistory.map(item => item.calculationTime)).toFixed(2);
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="blockchain-explorer">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <h2>Loading blockchain data...</h2>
                    </div>
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
                                <span>{blockchainData.chain?.length || 0}</span>
                            </div>
                            <div className="info-box">
                                <label>Chain Status:</label>
                                <span className={`status ${blockchainData.is_valid ? 'valid' : 'invalid'}`}>
                                    {blockchainData.is_valid ? 
                                        <><FaCheckCircle /> Valid</> : 
                                        <><FaTimesCircle /> Invalid</>
                                    }
                                </span>
                            </div>
                            <div className="info-box">
                                <label>Latest Block:</label>
                                <span>
                                    {blockchainData.chain?.[blockchainData.chain.length - 1]?.index || 0}
                                </span>
                            </div>
                        </div>
                    )}
                    
                    <div className="blockchain-controls">
                        <button 
                            className={`view-toggle ${viewMode === 'chain' ? 'active' : ''}`} 
                            onClick={() => setViewMode('chain')}
                        >
                            <FaLink /> Chain View
                        </button>
                        <button 
                            className={`view-toggle ${viewMode === 'timeline' ? 'active' : ''}`} 
                            onClick={() => setViewMode('timeline')}
                        >
                            <FaHistory /> Timeline View
                        </button>
                        <button 
                            className={`view-toggle ${showPerformance ? 'active' : ''}`} 
                            onClick={() => setShowPerformance(!showPerformance)}
                        >
                            <FaClock /> Performance
                        </button>
                        <button 
                            className="demo-button" 
                            onClick={simulateNewBlock}
                            disabled={processingBlock}
                        >
                            {processingBlock ? 'Processing...' : 'Simulate New Block'}
                        </button>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                {/* Block Creation Status */}
                {blockCreationStatus && (
                    <div className={`block-creation-status ${blockCreationStatus.status}`}>
                        <div className="status-header">
                            <h3>{blockCreationStatus.status === 'processing' ? 'Creating New Block' : 'Block Created'}</h3>
                            {blockCreationStatus.status === 'complete' && (
                                <div className="creation-time">
                                    <FaClock /> {blockCreationStatus.calculationTime} ms
                                </div>
                            )}
                        </div>
                        
                        {blockCreationStatus.status === 'processing' ? (
                            <div className="creation-progress">
                                <div className="progress-message">{blockCreationStatus.message}</div>
                                <div className="progress-bar-container">
                                    <div 
                                        className="progress-bar" 
                                        style={{width: `${blockCreationStatus.progress}%`}}
                                    ></div>
                                </div>
                            </div>
                        ) : (
                            <div className="creation-complete">
                                <div className="status-message">{blockCreationStatus.message}</div>
                                <div className="hash-result">
                                    <label>Generated Hash:</label>
                                    <code>{blockCreationStatus.hash}</code>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Performance Metrics (Simple Table) */}
                {showPerformance && (
                    <div className="performance-container">
                        <h3>Block Creation Performance</h3>
                        
                        <div className="performance-stats">
                            <div className="stat-box">
                                <label>Blocks Created:</label>
                                <span>{performanceHistory.length}</span>
                            </div>
                            <div className="stat-box">
                                <label>Avg Creation Time:</label>
                                <span>{getAverageTime()} ms</span>
                            </div>
                            <div className="stat-box">
                                <label>Fastest Block:</label>
                                <span>{getFastestTime()} ms</span>
                            </div>
                        </div>
                        
                        {performanceHistory.length > 0 && (
                            <div className="performance-history">
                                <h4>Block Creation History</h4>
                                <div className="performance-bars">
                                    {performanceHistory.map((record, index) => (
                                        <div className="performance-record" key={index}>
                                            <div className="record-label">
                                                <span>Block #{record.blockIndex}</span>
                                                <span className="time-label">{record.timestamp}</span>
                                            </div>
                                            <div className="time-bar-container">
                                                <div 
                                                    className="time-bar" 
                                                    style={{
                                                        width: `${Math.min(100, record.calculationTime / 10)}%`
                                                    }}
                                                ></div>
                                                <span className="time-value">{record.calculationTime} ms</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Chain View */}
                {viewMode === 'chain' && (
                    <div className="blockchain-visualization chain-view">
                    {blockchainData?.chain.map((block, index) => (
                        <div key={block.hash} className="block-container">
                                <motion.div 
                                className={`block ${selectedBlock?.index === block.index ? 'selected' : ''}`}
                                onClick={() => handleBlockClick(block)}
                                    whileHover={{ scale: 1.02 }}
                                    initial={block === newBlock ? { scale: 0.8, opacity: 0 } : false}
                                    animate={block === newBlock ? { scale: 1, opacity: 1 } : {}}
                                    transition={{ duration: 0.5 }}
                            >
                                <div className="block-header">
                                    <div className="block-title">
                                        <h3>Block #{block.index}</h3>
                                        <span className="timestamp">
                                            {new Date(block.timestamp * 1000).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="block-action">
                                            {block.data.record_type === 'donation' ? 
                                                <span className="donation-tag">Donation</span> : 
                                                block.data.action
                                            }
                                        </div>
                                </div>

                                    <AnimatePresence>
                                {selectedBlock?.index === block.index && (
                                            <motion.div 
                                                className="block-details"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
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
                                                <div className="block-actions">
                                                    <button 
                                                        className="hash-demo-button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            showHashDemo(block);
                                                        }}
                                                    >
                                                        <FaInfoCircle /> Show Hash Tampering Demo
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                                {index < blockchainData.chain.length - 1 && (
                                    <div className="block-arrow-container">
                                        <div className="block-arrow">→</div>
                                        <div className="block-arrow-label">Hash Reference</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Timeline View */}
                {viewMode === 'timeline' && (
                    <div className="blockchain-visualization timeline-view">
                        <div className="timeline-line"></div>
                        {blockchainData?.chain.map((block, index) => (
                            <motion.div 
                                key={block.hash} 
                                className="timeline-block"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="timeline-dot"></div>
                                <div 
                                    className={`timeline-content ${selectedBlock?.index === block.index ? 'selected' : ''}`}
                                    onClick={() => handleBlockClick(block)}
                                >
                                    <div className="timeline-header">
                                        <h3>Block #{block.index}</h3>
                                        <span className="timestamp">
                                            {new Date(block.timestamp * 1000).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="timeline-type">
                                        {block.data.record_type === 'donation' ? 
                                            <span className="donation-timeline-tag">Donation</span> : 
                                            <span className="action-timeline-tag">{block.data.action}</span>
                                        }
                                    </div>
                                    
                                    {block.data.record_type === 'donation' && (
                                        <div className="donation-summary">
                                            <span className="donation-amount">₹{block.data.amount}</span>
                                            <span className="donation-purpose">{block.data.purpose}</span>
                                        </div>
                                    )}
                                    
                                    <div className="timeline-hash">
                                        <span className="hash-label">Hash:</span>
                                        <code className="hash-preview">{block.hash.substring(0, 15)}...</code>
                                    </div>
                                    
                                    <AnimatePresence>
                                        {selectedBlock?.index === block.index && (
                                            <motion.div 
                                                className="timeline-details"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
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
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
                
                {/* Hash Tampering Demo Modal */}
                {hashDemo.active && (
                    <div className="hash-demo-modal">
                        <div className="hash-demo-content">
                            <h3>Blockchain Integrity Demonstration</h3>
                            <p>This demonstration shows how changing any data in a block invalidates its hash and breaks the chain.</p>
                            
                            <div className="hash-demo-container">
                                <div className="hash-demo-original">
                                    <h4>Original Block</h4>
                                    <div className="demo-block">
                                        <div className="demo-hash">
                                            <label>Hash:</label>
                                            <code>{hashDemo.originalHash}</code>
                                        </div>
                                        <div className="demo-data">
                                            <label>Data:</label>
                                            <pre>{JSON.stringify(hashDemo.originalData, null, 2)}</pre>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="hash-demo-modified">
                                    <h4>Modified Block</h4>
                                    <div className="demo-block">
                                        <div className="demo-hash">
                                            <label>Hash:</label>
                                            <code className={hashDemo.modifiedHash !== hashDemo.originalHash ? 'invalid-hash' : ''}>
                                                {hashDemo.modifiedHash || hashDemo.originalHash}
                                            </code>
                                            {hashDemo.modifiedHash !== hashDemo.originalHash && (
                                                <span className="hash-warning">
                                                    <FaTimesCircle /> Hash is invalid! Chain integrity broken.
                                                </span>
                                            )}
                                        </div>
                                        <div className="demo-data">
                                            <label>Edit Data:</label>
                                            <div className="demo-input-group">
                                                {Object.keys(hashDemo.modifiedData).map(key => (
                                                    <div key={key} className="demo-input-field">
                                                        <label>{key}:</label>
                                                        <input 
                                                            type="text" 
                                                            value={hashDemo.modifiedData[key]} 
                                                            onChange={(e) => updateHashDemoData(key, e.target.value)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="demo-chain-impact">
                                <h4>Chain Impact</h4>
                                <p>When a block's data is modified, all subsequent blocks become invalid because they reference the previous block's hash.</p>
                                <div className="demo-chain">
                                    <div className="demo-chain-block modified">
                                        <div>Block #{hashDemo.block.index}</div>
                                        <div className="demo-chain-hash invalid">Invalid Hash</div>
                                    </div>
                                    <div className="demo-chain-arrow">→</div>
                                    <div className="demo-chain-block invalid">
                                        <div>Block #{hashDemo.block.index + 1}</div>
                                        <div className="demo-chain-hash invalid">Invalid Reference</div>
                                    </div>
                                    <div className="demo-chain-arrow">→</div>
                                    <div className="demo-chain-block invalid">
                                        <div>Block #{hashDemo.block.index + 2}</div>
                                        <div className="demo-chain-hash invalid">Invalid Reference</div>
                                    </div>
                                </div>
                            </div>
                            
                            <button className="close-demo-button" onClick={() => setHashDemo({active: false})}>
                                Close Demonstration
                            </button>
                        </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default BlockchainExplorer; 