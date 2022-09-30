import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from '@material-ui/core/styles';
import {useNavigate} from 'react-router-dom';
import Features from '../components/Features';
import Carousel from 'react-material-ui-carousel';
const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 345,
    },
    heading: {
        textAlign: 'center',
        marginTop: '40px',
    },
    footer: {
        textAlign: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100% !important',
        height: '100px !important',
        background: '#091216',
        color: 'white',
        paddingTop: 30,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    marketBtn: {
        marginTop: 10,
        display: 'block',
        [theme.breakpoints.up('sm')]: {
            width: '350px',
            fontSize: '1.1em',
        },
    },
    banner: {
        position: 'relative',
    },
    bannerimg: {
        maxWidth: '100%',
        borderRadius: '30px',
    },
    anchor: {
        position: 'absolute',
        bottom: '-15px',
        background: 'white',
        borderRadius: '100%',
        padding: '5px',
        width: '40px',
        border: '1px solid black',
        left: 'calc(50% - 20px)',
    },
}));
function shuffle(array) {
    var m = array.length,
        t,
        i;

    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}
export default function Sale(props) {
    const classes = useStyles();

    const navigate = useNavigate();
    var cards = [
        {
            title: 'Tyler Monsein & Dakota Light-Smith',
            link: '/marketplace/tylerdakota',
            image: '/collections/dv6u3-vqaaa-aaaah-qcdlq-cai.jpg',
            content: (
                <>
                    Tyler and Dakota are a writer / designer team interested in semiotics and
                    altered states.
                </>
            ),
        },
        {
            title: 'Neil White',
            link: '/marketplace/neilwhite',
            image: '/collections/crt3j-mqaaa-aaaah-qcdnq-cai.jpg',
            content: (
                <>
                    Neil White is a Miami-based contemporary artist. His work focuses on ironic
                    portraits of historical icons and social commentary in the form of robots.
                </>
            ),
        },
        {
            title: 'André Wee',
            link: '/marketplace/andrewee',
            image: '/collections/cnxby-3qaaa-aaaah-qcdpq-cai.jpg',
            content: (
                <>
                    André Wee, a newcomer to the NFT Art scene, is an experimental illustrator that
                    jumps between both the virtual and physical world when he creates his craft.
                </>
            ),
        },
        {
            title: 'Ludo',
            link: '/marketplace/ludo',
            image: '/collections/ludo.jpg',
            content: (
                <>
                    The work of Paris-based Ludo (Ludovic Vernhet) explores a world where
                    biotechnological chimeras offer to merge plants and animals with our
                    technological universe.
                </>
            ),
        },
        {
            title: 'PatternBased',
            link: '/marketplace/patternbased',
            image: '/collections/ckwhm-wiaaa-aaaah-qcdpa-cai.jpg',
            content: (
                <>
                    PatternBased is a boutique creative label at the intersection of art and
                    technology. PatternBased is Siori Kitajima and Joseph Minadeo.
                </>
            ),
        },
        {
            title: 'Selay Karasu',
            link: '/marketplace/selaykarasu',
            image: '/collections/cdvmq-aaaaa-aaaah-qcdoq-cai.jpg',
            content: (
                <>
                    Selay Karasu is a multidisciplinary artist and creative director based in
                    Istanbul. 10 years in the industry she did numerous projection mapping and
                    public art installations.
                </>
            ),
        },
        {
            title: 'Ryan P. Griffin',
            link: '/marketplace/ryanpgriffin',
            image: '/collections/ryangriffin.jpg',
            content: (
                <>
                    Ryan P. Griffin is a visual artist based out of Los Angeles, CA. Griffin uses
                    projected light as a vehicle to activate the environment in a poetic,
                    performative and public way.
                </>
            ),
        },
        {
            title: 'Chloe Yee May',
            link: '/marketplace/chloeyeemay',
            image: '/collections/chloeyeemay.jpg',
            content: (
                <>
                    An illustrator, artist currently based in New York City, Chloe tackles visual
                    storytelling through illustration with experience in branding, concept art,
                    character design, editorial, NFTs.
                </>
            ),
        },
    ];
    return (
        <>
            <div style={{width: '100%', display: 'block', position: 'relative'}}>
                <div
                    style={{
                        maxWidth: 1200,
                        margin: '120px auto 0px',
                        paddingBottom: 200,
                    }}
                >
                    <h1 className={classes.heading}>The Iconic Collection 2021</h1>
                    <div
                        style={{
                            textAlign: 'center',
                            fontSize: '1.3em',
                            padding: '0 30px',
                        }}
                    >
                        <p>
                            The ICONIC art installation is a celebration of NFT artists on the
                            Internet Computer blockchain (or “IC” for short). The exhibit features
                            artists from all over the world, including New York, Los Angeles, Miami,
                            Singapore, Japan, Istanbul, and Paris.
                        </p>

                        <p>
                            Much of the depiction around our relationship with technology in the
                            media is overwhelmingly negative. Films and shows such as Blade Runner,
                            The Matrix, Minority Report, Ghost in the Shell, and so on present a
                            bleak dystopia, where technology is wielded in a way to control and
                            surveil the populace.
                        </p>

                        <p>
                            In contrast, ICONIC seeks to reframe our relationship with technology
                            and imagine how technology can be used to bridge and connect humanity,
                            as well as empower the individual, through decentralized technologies
                            such as the Internet Computer. The artwork featured in the exhibit brims
                            with scintillating techno-optimism for the future, with pieces that are
                            unabashedly bold, dynamic, energetic, and full of life. In this brave
                            new world, it is the artists and creators who wield the power, for art
                            is the most distilled expression of the human condition.
                        </p>

                        <p>
                            To this end, NFTs have become a powerful new vehicle for artists to
                            share their creative vision. The most innovative artists have always
                            used new technology and media as a means to amplify their core message.
                        </p>

                        <p>
                            <strong>
                                Enjoy ICONIC, and let’s dream of a brighter, more colorful future,
                                one where technology ignites in us once again a sense of wonder and
                                hope.
                            </strong>
                        </p>
                    </div>
                    <Grid container direction="row" justifyContent="center" alignItems="center">
                        {shuffle(cards).map((card, i) => {
                            return (
                                <Grid key={i} item md={4} style={{marginBottom: 20}}>
                                    <Card className={classes.root}>
                                        {card.link ? (
                                            <a href={card.link}>
                                                <CardMedia
                                                    className={classes.media}
                                                    image={card.image}
                                                    title={card.title}
                                                />
                                            </a>
                                        ) : (
                                            <CardMedia
                                                className={classes.media}
                                                image={card.image}
                                                title={card.title}
                                            />
                                        )}
                                        <CardContent>
                                            <h3>{card.title}</h3>
                                            <Typography
                                                style={{
                                                    display: 'block',
                                                    height: '125px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                                variant="body1"
                                                color="textSecondary"
                                                component="p"
                                            >
                                                {card.content}
                                            </Typography>
                                            <strong>
                                                {card.link ? (
                                                    <a href={card.link} style={{color: 'black'}}>
                                                        View Collection
                                                    </a>
                                                ) : (
                                                    'Collection coming soon'
                                                )}
                                            </strong>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </div>
                <div className={classes.footer}>
                    <Typography variant="body1">
                        Developed by ToniqLabs &copy; All rights reserved 2021
                    </Typography>
                </div>
            </div>
        </>
    );
}
