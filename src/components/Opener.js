import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import HoverVideoPlayer from 'react-hover-video-player';
import extjs from '../ic/extjs.js';
import Flip from './Flip';

var subs = [];
export default function Opener(props) {
    const [playOpen, setPlayOpen] = React.useState(false);
    const [openerOpen, setOpenerOpen] = React.useState(false);
    const [openerCards, setOpenerCards] = React.useState([]);
    const [toggleFlip, setToggleFlip] = React.useState(0);
    const hoverVideoRef = React.useRef();
    const rnum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    React.useEffect(() => {
        if (props.open) openPack();
    }, [props.open]);
    React.useEffect(() => {
        if (playOpen) {
            const videoElement = hoverVideoRef.current;
            videoElement.onended = showPack;
        }
    }, [playOpen]);
    const onFlip = async (a) => {
        for (var i = 0; i < subs.length; i++) {
            if (i == a) continue;
            subs[i]();
        }
    };
    const flipSubscriber = async (i, a) => {
        subs[i] = a;
    };
    const openPack = async () => {
        setPlayOpen(true);
        setOpenerOpen(true);
        //hot api, will sign as identity - BE CAREFUL
        try {
            var r = await extjs
                .connect('https://boundary.ic0.app/', props.identity)
                .canister(props.nft.canister, 'ext')
                .unpack(props.nft.id, [extjs.toSubaccount(props.currentAccount ?? 0)]);
            if (r.hasOwnProperty('err')) throw r.err;
            setOpenerCards(r.ok.map((a) => a[1].nonfungible.metadata[0]));
            //setTimeout(() => setOpenerCards([[rnum(1,50), rnum(0,5)],[rnum(1,50), rnum(0,5)],[rnum(1,50), rnum(0,5)],[rnum(1,50), rnum(0,5)],[rnum(1,50), rnum(0,5)]]), 1000);
        } catch (e) {
            setPlayOpen(false);
            setOpenerOpen(false);
            props.onEnd();
            console.log(e);
            props.alert('Error', 'Sorry, something went wrong!');
        }
    };
    const closePack = () => {
        setOpenerCards([]);
        setOpenerOpen(false);
    };
    const showPack = () => {
        props.onEnd();
        setPlayOpen(false);
    };
    return (
        <>
            {playOpen ? (
                <>
                    <HoverVideoPlayer
                        videoRef={hoverVideoRef}
                        muted={false}
                        volume={0.3}
                        style={{
                            backgroundColor: 'black',
                            position: 'fixed',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            zIndex: 1700,
                        }}
                        focused={playOpen}
                        loop={false}
                        videoSrc="/opening.mp4"
                    />
                    <Button
                        variant={'outlined'}
                        onClick={showPack}
                        color={'primary'}
                        style={{
                            position: 'fixed',
                            right: 50,
                            bottom: 100,
                            color: 'white',
                            borderColor: 'white',
                            zIndex: 1800,
                            fontWeight: 'bold',
                            margin: '20px auto',
                        }}
                    >
                        Skip
                    </Button>
                </>
            ) : (
                ''
            )}
            <Backdrop
                style={{backgroundColor: 'rgba(0,0,0,.8)', zIndex: 1600, color: 'white'}}
                open={openerOpen}
            >
                {openerCards.length === 0 ? (
                    <>
                        <CircularProgress color="inherit" />
                        <h2 style={{position: 'absolute', marginTop: '120px'}}>Opening pack...</h2>
                    </>
                ) : (
                    <>
                        <div style={{textAlign: 'center', width: 1600, margin: '0 auto'}}>
                            <h2>You've just opened a pack!</h2>
                            <Grid
                                container
                                spacing={2}
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                            >
                                {openerCards.map((a, i) => {
                                    return (
                                        <Flip
                                            key={i}
                                            id={i}
                                            onFlip={onFlip}
                                            flipSubscriber={flipSubscriber}
                                            card={a}
                                        />
                                    );
                                })}
                            </Grid>
                            <Button
                                variant={'outlined'}
                                onClick={closePack}
                                color={'primary'}
                                style={{fontWeight: 'bold', margin: '20px auto'}}
                            >
                                Continue
                            </Button>
                        </div>
                    </>
                )}
            </Backdrop>
        </>
    );
}
