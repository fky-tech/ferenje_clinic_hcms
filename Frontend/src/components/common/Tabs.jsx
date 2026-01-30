import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext();

export function Tabs({ defaultValue, children, className = '' }) {
    const [activeTab, setActiveTab] = useState(defaultValue);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
}

export function TabsList({ children, className = '' }) {
    return <div className={className}>{children}</div>;
}

export function TabsTrigger({ value, children, className = '' }) {
    const { activeTab, setActiveTab } = useContext(TabsContext);
    const isActive = activeTab === value;

    // Default styles if no className provided, but allowing override
    // Actually, dashboard implementation passed specific classes.
    // However, if we want to make it generic we should handle internal state cleanly.
    // The Dashboard implementation uses its OWN state for tabs (activeTab state in Dashboard.jsx).
    // Wait, Dashboard.jsx renders:
    /*
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-3">
            <button onClick={() => setActiveTab('lab')} ... >Laboratory</button>
            <button ... >Ultrasound</button>
        </div>
        {activeTab === 'lab' && ...}
    */

    // NOTE: My previous edit to Dashboard.jsx actually implemented the buttons MANUALLY divs and buttons, 
    // it DID NOT use <Tabs>, <TabsList>, <TabsTrigger> components in the render output!
    // BUT I added the IMPORT statement: `import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/common/Tabs';`
    // The import is there, but the *USAGE* might not be fully there or I mixed the implementation.

    // Let's re-read Dashboard.jsx from previous steps. 
    // Step 531:
    // I added the IMPORT.
    // I implemented `const [activeTab, setActiveTab] = useState('lab');`
    // I implemented the UI using standard `<button>` elements, NOT `<TabsTrigger>`.

    // So the ERROR is simply that the IMPORT exists but the file doesn't.
    // AND I am not even using the imported components in the code I wrote (I used manual buttons because it's simpler often).

    // Resolution: either remove the unused import OR create the file.
    // Since I might want to use it properly later, I will create the file to satisfy the import. 
    // OR BETTER: Remove the unused import from Dashboard.jsx. 
    // The user's code HAS the import. 

    // Let's remove the unused import to keep it clean.
    // Wait, did I use them?
    // Looking at Step 531 again... 
    // I replaced the content.
    // The render method uses:
    // <div className="bg-white rounded-lg border border-gray-200 p-2">
    //    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-3">
    //        <button onClick={() => setActiveTab('lab')} ...
    // ...
    //    {activeTab === 'lab' && renderDashboardContent(...)}

    // I did NOT use <Tabs> components. I used manual state lifting.
    // So the correct fix is to REMOVE the import line.

    return (
        <button
            className={`${className} ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(value)}
        >
            {children}
        </button>
    );
}

export function TabsContent({ value, children, className = '' }) {
    const { activeTab } = useContext(TabsContext);
    if (activeTab !== value) return null;
    return <div className={className}>{children}</div>;
}
