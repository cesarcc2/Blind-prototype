import React, { useEffect, useState } from 'react';
import { init, useFocusable, FocusContext, setFocus } from '@noriginmedia/norigin-spatial-navigation';

init({
  debug: false,
  visualDebug: false
});

function speak(text: string) {
  const synth = window.speechSynthesis;
  synth.cancel(); // Cancel any ongoing speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.lang = 'en-US'; // or 'pt-PT', etc.
  synth.speak(utterance);
}


// ========== ROOT APP ==========
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div style={{ display: 'flex' }}>
      <SideMenu setCurrentPage={setCurrentPage} />
      <ContentArea currentPage={currentPage} />
    </div>
  );
};

export default App;

// ========== SIDE MENU ==========
function SideMenu({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  const { ref, focusKey } = useFocusable();

  useEffect(() => {
    if (focusKey) {
      setFocus(focusKey);
    }
  }, [focusKey]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        style={{
          width: 200,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          backgroundColor: '#222',
          padding: '20px',
          borderRight: '2px solid white',
          height: '100vh',
          boxSizing: 'border-box'
        }}
      >
        <MenuButton label="Home" page="home" setCurrentPage={setCurrentPage} />
        <MenuButton label="Settings" page="settings" setCurrentPage={setCurrentPage} />
        <MenuButton label="Profile" page="profile" setCurrentPage={setCurrentPage} />
        <MenuButton label="Logout" page="logout" setCurrentPage={setCurrentPage} />
      </div>
    </FocusContext.Provider>
  );
}

function MenuButton({ label, page, setCurrentPage }: { label: string, page: string, setCurrentPage: (page: string) => void }) {
  const { ref, focused } = useFocusable({
    onFocus: () => {
      console.log('Focused menu:', label);
      speak(label); // Announce the menu item
    },
    onEnterPress: () => {
      console.log('Navigating to:', page);
      speak("Entered " + label + "page");
      setCurrentPage(page);
    }
  });

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: 50,
        backgroundColor: focused ? 'blue' : 'gray',
        border: focused ? '3px solid red' : '3px solid transparent',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        cursor: 'pointer'
      }}
    >
      {label}
    </div>
  );
}

// ========== CONTENT AREA ==========
function ContentArea({ currentPage }: { currentPage: string }) {
  return (
    <div
      style={{
        flex: 1,
        padding: 20,
        overflowY: 'auto',
        height: '100vh',
        backgroundColor: '#111',
      }}
    >
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'settings' && <SettingsPage />}
      {currentPage === 'profile' && <ProfilePage />}
      {currentPage === 'logout' && <LogoutPage />}
    </div>
  );
}

// ========== DIFFERENT PAGES ==========
function HomePage() {
  return (
    <>
      <h1 style={{ color: 'white' }}>Home Page</h1>
      <ContentGrid />
    </>
  );
}

function SettingsPage() {
  return (
    <>
      <h1 style={{ color: 'white' }}>Settings Page</h1>
      <p style={{ color: 'white' }}>Settings content here.</p>
    </>
  );
}

function ProfilePage() {
  return (
    <>
      <h1 style={{ color: 'white' }}>Profile Page</h1>
      <p style={{ color: 'white' }}>Profile info here.</p>
    </>
  );
}

function LogoutPage() {
  return (
    <>
      <h1 style={{ color: 'white' }}>Logout Page</h1>
      <p style={{ color: 'white' }}>Are you sure you want to logout?</p>
    </>
  );
}

// ========== GRID CONTENT (only on Home) ==========
function ContentGrid() {
  const { ref, focusKey } = useFocusable();

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          justifyContent: 'center',
          marginTop: 20
        }}
      >
        <Button label="Button 1" />
        <Button label="Button 2" />
        <Button label="Button 3" />
        <TextWithCheckbox text="Hello world" />
        <TextWithCheckbox text="Good morning" />
        <TextWithCheckbox text="Good night" />
      </div>
    </FocusContext.Provider>
  );
}

// ========== BUTTON ==========
function Button({ label }: { label: string }) {
  const { ref, focused } = useFocusable({
    onFocus: () => {
      console.log('Focused:', label);
      speak(label); // Announce the button
    },
    onEnterPress: () => speak("clicked " + label)
  });

  return (
    <div
      ref={ref}
      style={{
        width: 150,
        height: 50,
        backgroundColor: 'blue',
        border: focused ? '4px solid red' : '4px solid transparent',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 8,
        cursor: 'pointer'
      }}
    >
      {label}
    </div>
  );
}

// ========== TEXT + CHECKBOX ==========
function TextWithCheckbox({ text }: { text: string }) {
  const { ref, focusKey } = useFocusable();

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        style={{
          width: 200,
          backgroundColor: '#333',
          border: '2px solid white',
          borderRadius: 8,
          margin: 10,
          padding: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          color: 'white'
        }}
      >
        <TextItem label={text} />
        <CheckboxItem label="Select" />
      </div>
    </FocusContext.Provider>
  );
}

function TextItem({ label }: { label: string }) {
  const { ref, focused } = useFocusable({
    onFocus: () => {
      console.log('Speak Text:', label);
      speak(label); // Announce the text
    }
  });

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: focused ? 'green' : 'transparent',
        padding: 8,
        borderRadius: 4,
        border: focused ? '2px solid yellow' : '2px solid transparent',
        cursor: 'pointer'
      }}
    >
      {label}
    </div>
  );
}

function CheckboxItem({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);
  const { ref, focused } = useFocusable({
    onFocus: () => {
      console.log('Checkbox Focused:', label);
      speak(`${label}, ${checked ? 'Checked' : 'Unchecked'}`); // Speak checkbox state too!
    },
    onEnterPress: () => {
      setChecked(prev => !prev);
      speak(`${label}, ${checked ? 'Checked' : 'Unchecked'}`);
    }
  });

  return (
    <label
      ref={ref}
      style={{
        backgroundColor: focused ? 'green' : 'transparent',
        padding: 8,
        borderRadius: 4,
        border: focused ? '2px solid yellow' : '2px solid transparent',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer'
      }}
    >
      <input type="checkbox" checked={checked} readOnly />
      {label}
    </label>
  );
}
