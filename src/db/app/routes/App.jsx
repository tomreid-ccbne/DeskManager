import React, { useState, useCallback, useRef, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import DataLoader from './components/DataLoader';
import LoginModal from './components/LoginModal';
import Desk from './components/Desk';
import EditDeskModal from './components/EditDeskModal';
import HistoryModal from './components/HistoryModal';
import UserManagementModal from './components/UserManagementModal';
import Menu from './components/Menu';

// Configuration
const DATABASE_URL = 'http://10.3.10.98:5000';
const MAX_HISTORY_LENGTH = 150;

function App() {
    const { token, user, logout } = useContext(AuthContext);
    const userRole = user?.role;

    // --- State Management ---
    const [desks, setDesks] = useState([]);
    const [users, setUsers] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedDeskIds, setSelectedDeskIds] = useState(new Set());
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, deskId: null });
    const [layoutHistoryLog, setLayoutHistoryLog] = useState([]);
    const [deskHistoryLog, setDeskHistoryLog] = useState([]);
    const [isLayoutHistoryOpen, setIsLayoutHistoryOpen] = useState(false);
    const [isDeskHistoryOpen, setIsDeskHistoryOpen] = useState(false);
    const [historyDeskTarget, setHistoryDeskTarget] = useState(null);
    const [settings, setSettings] = useState({
        darkMode: false, layoutWidth: 100, zoom: 100, gridSnap: 5, gridSnapEnabled: true,
        backgroundImage: `url('https://placehold.co/1200x675/f0f0f0/cccccc?text=Your+Office+Layout+Image')`,
        imageVisible: true, aspectRatio: '16 / 9'
    });

    // --- Refs ---
    const historyRef = useRef({ stack: [], index: -1 });
    const clipboardRef = useRef(null);
    const wasDraggingRef = useRef(false);
    const debounceTimerRef = useRef(null);
    const deskLayoutRef = useRef(null);
    const pastePositionRef = useRef({ x: 0, y: 0 });

    // --- API & WebSocket Logic ---
    const fetchWithAuth = useCallback((url, options = {}) => {
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return fetch(url, { ...options, headers });
    }, [token]);

    const debouncedSaveToDatabase = useCallback(() => {
        if (!userRole) return;
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(async () => {
            try {
                const layoutData = { desks, ...settings };
                await fetchWithAuth(`${DATABASE_URL}/layout-data`, {
                    method: 'POST', body: JSON.stringify(layoutData),
                });
            } catch (error) { console.error("Failed to save to database:", error); }
        }, 5000);
    }, [desks, settings, userRole, fetchWithAuth]);
    
    // The auto-save effect now only depends on the data, not the loading logic
    useEffect(() => {
        debouncedSaveToDatabase();
    }, [desks, settings, debouncedSaveToDatabase]);

    // ... (History Management, Event Handlers, etc. remain the same)

    const saveState = useCallback((newDesksState) => {
        const currentStack = historyRef.current.stack.slice(0, historyRef.current.index + 1);
        currentStack.push(JSON.parse(JSON.stringify(newDesksState)));
        if (currentStack.length > MAX_HISTORY_LENGTH) {
            currentStack.shift();
        }
        historyRef.current.stack = currentStack;
        historyRef.current.index = currentStack.length - 1;
    }, []);

    const addDesk = () => {
        if (userRole !== 'admin') return;
        const newId = desks.length > 0 ? Math.max(...desks.map(d => d.id)) + 1 : 1;
        const newDesk = { id: newId, occupant: 'Vacant', department: '', notes: '', x: 50, y: 50, w: 12, h: 12, teamLead: '', breaks: '', sales: 0, color: null };
        const newDesks = [...desks, newDesk];
        setDesks(newDesks);
        saveState(newDesks);
    };

    return (
        <>
            <DataLoader
                setDesks={setDesks}
                setUsers={setUsers}
                setSettings={setSettings}
                historyRef={historyRef}
                fetchWithAuth={fetchWithAuth}
            />
            <style>{`
                .glassmorphism { background: rgba(255, 255, 255, 0.5); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.2); }
                .dark .glassmorphism { background: rgba(26, 32, 44, 0.6); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); }
                .vacant { background-color: rgba(229, 231, 235, 0.7); border-style: dashed; }
                .dark .vacant { background-color: rgba(55, 65, 81, 0.5); }
                .desk.selected { outline: 3px solid #60a5fa; outline-offset: 2px; z-index: 20; }
                .remove-desk-btn, .resize-handle { display: none; }
                .desk:hover .remove-desk-btn, .desk:hover .resize-handle { display: flex; }
            `}</style>
            <div className={`flex flex-col h-screen w-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden ${settings.darkMode ? 'dark' : ''}`}>
                <div className="absolute top-0 left-0 right-0 p-4 z-30">
                    <div className="glassmorphism max-w-7xl mx-auto rounded-xl shadow-md p-4 flex items-center justify-between border">
                        <header className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Office Desk Layout</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {userRole ? (editMode ? 'Admin Mode: Edit layout and desk info.' : 'Logged In: Click a desk to edit its info.') : 'Read-Only Mode: Hover for details or login to edit.'}
                            </p>
                        </header>
                         <div className="flex items-center gap-4">
                            {userRole === 'admin' && (
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium text-sm">Edit Mode</span>
                                    <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={editMode} onChange={e => setEditMode(e.target.checked)} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div></label>
                                </div>
                            )}
                            {user ? (
                                <button onClick={logout} className="px-4 py-2 bg-red-500/80 text-white rounded-lg text-sm font-semibold">Logout ({user.name})</button>
                            ) : (
                                <button onClick={() => setIsLoginModalOpen(true)} className="px-4 py-2 bg-blue-600/90 text-white rounded-lg text-sm font-semibold">Login</button>
                            )}
                         </div>
                    </div>
                </div>

                <div className="relative flex-grow flex items-start justify-center overflow-auto pt-32 p-4">
                     <main ref={deskLayoutRef} className="relative bg-gray-200 dark:bg-gray-700 bg-cover bg-center rounded-lg shadow-lg transition-all" style={{ width: `${settings.layoutWidth}%`, aspectRatio: settings.aspectRatio, backgroundImage: settings.imageVisible ? settings.backgroundImage : 'none' }}>
                        <div className="relative w-full h-full" style={{ transform: `scale(${settings.zoom / 100})`, transformOrigin: 'top left' }}>
                             {desks.map(d => 
                                <Desk key={d.id} desk={d} isSelected={selectedDeskIds.has(d.id)} userRole={userRole} editMode={editMode} />
                             )}
                        </div>
                    </main>
                </div>
                
                <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
                {/* Other modals will be rendered here */}
            </div>
        </>
    );
}

export default App;

