import React, { useEffect } from 'react';
import './styles/thin.css';

const Widget = () => {

  useEffect(() => {
    const isShared = (window as any).shellReact === React;
    
    if (isShared) {
      console.log('Module: Success - using the Shell\'s React instance.');
    } else {
      console.warn('Module: Alert - has its own independent React instance');
    }
  }, []);

  return (
    <div className="mfe-template">
      <h4 className="text-white bg-primary">Module Template</h4>
    </div>
  );
};

export default Widget;