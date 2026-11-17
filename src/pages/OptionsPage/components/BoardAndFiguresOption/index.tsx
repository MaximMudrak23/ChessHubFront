import s from './styles.module.scss'
import { useEffect, useState } from 'react';
import Option from '@/components/UI/Option';
import Button from '@/components/UI/Button';
import { BACKGROUNDS, BOARDS, CHESS_PIECES } from '@/constants/paths';
import { useUserStore } from '@/store/userStore';
import type { BoardTheme, MenuBackground, PieceSet } from '@/types/user.types';
import BoardPreview from './components/BoardPreview';
import { getAppearance } from '@/utils/getAppearance';
import { saveAppearance } from '../../utils/saveAppearance';

const CATEGORIES = ['Boards', 'Pieces', 'Backgrounds'];
const BOARD_IDS = Object.keys(BOARDS) as BoardTheme[];
const PIECE_SET_IDS = Object.keys(CHESS_PIECES) as PieceSet[];
const BACKGROUND_IDS = Object.keys(BACKGROUNDS) as MenuBackground[];

export default function BoardAndFiguresOption() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedBoard, setSelectedBoard] = useState<BoardTheme | null>(null);
    const [selectedPieceSet, setSelectedPieceSet] = useState<PieceSet | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const selectedBackground = useUserStore(s => s.backgroundOverride);
    const setSelectedBackground = useUserStore(s => s.setBackgroundOverride);
    const user = useUserStore(s => s.user);
    const token = useUserStore(s => s.token);

    useEffect(() => {
        return () => setSelectedBackground(null);
    }, [setSelectedBackground]);

    const savedAppearance = getAppearance(user);
    const boardTheme = selectedBoard ?? savedAppearance.boardTheme;
    const pieceSet = selectedPieceSet ?? savedAppearance.pieceSet;
    const backgroundTheme = selectedBackground ?? savedAppearance.menuBackground;
    const hasChanges = boardTheme !== savedAppearance.boardTheme
        || pieceSet !== savedAppearance.pieceSet
        || backgroundTheme !== savedAppearance.menuBackground;
    const board = BOARDS[boardTheme];
    const pieces = CHESS_PIECES[pieceSet];
    const previews = selectedIndex === 0
        ? BOARD_IDS.map(id => ({
            id,
            name: BOARDS[id].name,
            src: BOARDS[id].preview,
            isActive: board === BOARDS[id],
            onSelect: () => setSelectedBoard(id),
        }))
        : selectedIndex === 1
            ? PIECE_SET_IDS.map(id => ({
                id,
                name: CHESS_PIECES[id].name,
                src: CHESS_PIECES[id].wn,
                isActive: pieceSet === id,
                onSelect: () => setSelectedPieceSet(id),
            }))
            : [];

    const handleDecline = () => {
        setSelectedBoard(null);
        setSelectedPieceSet(null);
        setSelectedBackground(null);
        setSaveError('');
    };

    const handleSave = async () => {
        if (!user || !token || isSaving || !hasChanges) return;

        setIsSaving(true);
        setSaveError('');

        try {
            const saved = await saveAppearance({
                boardTheme: selectedBoard ?? user.boardTheme ?? 'water',
                pieceSet: selectedPieceSet ?? user.pieceSet ?? 'default',
                menuBackground: selectedBackground ?? user.menuBackground ?? 'default',
            });
            if (!saved) return;

            setSelectedBoard(null);
            setSelectedPieceSet(null);
        } catch (error) {
            setSelectedBoard(null);
            setSelectedPieceSet(null);
            setSaveError(error instanceof Error ? error.message : 'Unable to save appearance. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={s.content}>
            <div className={s.categories} role='group' aria-label='Appearance categories'>
                {CATEGORIES.map((category, index) => (
                    <Option
                        key={category}
                        name={category}
                        isActive={selectedIndex === index}
                        isDisabled={isSaving}
                        fontSize='medium'
                        lineAxis='horizontal'
                        onClick={() => setSelectedIndex(index)}
                    />
                ))}
            </div>

            <div className={s.workspace}>
                <div className={s.selection}>
                    {previews.length > 0 && (
                        <div className={s.previews} role='group' aria-label={`${CATEGORIES[selectedIndex]} themes`}>
                            {previews.map(preview => (
                                <button
                                    key={preview.id}
                                    type='button'
                                    className={s.preview_option}
                                    aria-label={preview.name}
                                    aria-pressed={preview.isActive}
                                    title={preview.name}
                                    onClick={preview.onSelect}
                                    disabled={isSaving}
                                >
                                    <img src={preview.src} alt='' draggable={false} />
                                </button>
                            ))}
                        </div>
                    )}

                    {selectedIndex === 2 && (
                        <div className={s.backgrounds} role='group' aria-label='Background themes'>
                            {BACKGROUND_IDS.map(id => (
                                <button
                                    key={id}
                                    type='button'
                                    className={s.background_option}
                                    aria-pressed={backgroundTheme === id}
                                    style={{backgroundImage: `url('${BACKGROUNDS[id].url}')`}}
                                    onClick={() => setSelectedBackground(id)}
                                    disabled={isSaving}
                                >
                                    <span>{BACKGROUNDS[id].name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <BoardPreview board={board} pieces={pieces} />
            </div>

            <div className={s.actions}>
                <Button
                    text='Decline'
                    variant='profile'
                    animation='white-hover'
                    styleProps={{background: '#2B2927'}}
                    onClick={handleDecline}
                    active={!isSaving}
                />
                <Button
                    text={isSaving ? 'Saving...' : 'Save'}
                    variant='green'
                    animation='white-hover'
                    styleProps={{background: '#36552C'}}
                    active={!isSaving && hasChanges && Boolean(user && token)}
                    onClick={handleSave}
                />
            </div>
            {saveError && <p className={s.save_error} role='alert'>{saveError}</p>}
        </div>
    )
}
