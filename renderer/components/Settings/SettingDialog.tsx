import { IconX } from '@tabler/icons-react';
import { FC, useContext, useEffect, useRef } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { getSettings, saveSettings } from '@/utils/app/settings';

import { Settings } from '@/types/settings';

import HomeContext from '@/pages/api/home/home.context';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const SettingDialog: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation('settings');
  const settings: Settings = getSettings();
  const { state, dispatch } = useCreateReducer<Settings>({
    initialState: settings,
  });
  const { dispatch: homeDispatch } = useContext(HomeContext);
  const modalRef = useRef<HTMLDivElement>(null);
  const { dispatch: dispatchHome } = useContext(HomeContext);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        window.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      window.removeEventListener('mouseup', handleMouseUp);
      onClose();
    };

    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onClose]);

  const handleSave = () => {
    homeDispatch({ field: 'lightMode', value: state.theme });
    saveSettings(state);
  };

  const handleOpenChatbar = () => {
    dispatchHome({ field: 'showChatbar', value: true });
    localStorage.setItem('showChatbar', JSON.stringify(true));
  };

  const handleCloseChatbar = () => {
    dispatchHome({ field: 'showChatbar', value: false });
    localStorage.setItem('showChatbar', JSON.stringify(false));
  };

  // Render nothing if the dialog is not open.
  if (!open) {
    return <></>;
  }

  // Render the dialog.
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="fixed inset-0 z-10 overflow-hidden">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          />

          <div
            ref={modalRef}
            className="dark:border-netural-400 inline-block transform overflow-y-auto rounded-lg border border-gray-300 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#202123] sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
            role="dialog"
          >
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                cursor: 'pointer',
                backgroundColor: '#000',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => {
                onClose();
                handleOpenChatbar();
              }}
            >
              <IconX size={20} color="#fff" />
            </div>

            <div className="text-lg pb-4 font-bold text-black dark:text-neutral-200">
              {t('Settings')}
            </div>

            <div className="text-sm font-bold mb-2 text-black dark:text-neutral-200">
              {t('Theme')}
            </div>

            <select
              className="w-full cursor-pointer bg-transparent p-2 text-neutral-700 dark:text-neutral-200"
              value={state.theme}
              onChange={(event) => {
                dispatch({ field: 'theme', value: event.target.value });

                homeDispatch({ field: 'lightMode', value: event.target.value });

                saveSettings({
                  ...state,
                  theme: event.target.value as 'dark' | 'light',
                });
              }}
            >
              <option value="dark">{t('Dark mode')}</option>
              <option value="light">{t('Light mode')}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
