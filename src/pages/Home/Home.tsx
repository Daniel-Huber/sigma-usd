import React, { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import CoinsInfo from './components/CoinsInfo/CoinsInfo';
import PersonalInfo from './components/PersonalInfo/PersonalInfo';
import Header from '../../components/Header/Header';
import './Home.scss';
import { getBalanceFor } from '../../utils/explorer';
import { getWalletAddress, isWalletSaved } from '../../utils/helpers';
import { ergBalance, rcBalance, rcPrice, scBalance, scPrice } from '../../utils/ageHelper';
import { usdName } from 'utils/consts';
import { Trans, useTranslation } from 'react-i18next';

const Home = () => {
    const [ergVal, setErgVal] = useState(0);
    const [reserveVal, setReserveVal] = useState(0);
    const [stableVal, setStableVal] = useState(0);

    const updateParams = useCallback(async () => {
        if (isWalletSaved()) {
            const bal = await getBalanceFor(getWalletAddress());
            const ageBal = (await scBalance(bal)) / 100;
            let ergBal = (await ergBalance(bal)) / 1e9;
            let reserveBal = await rcBalance(bal);
            const agePrice = (await scPrice()) / 1e7;
            const reservePrice = (await rcPrice()) / 1e9;
            ergBal /= agePrice;
            reserveBal = (reserveBal * reservePrice) / agePrice;
            setReserveVal(reserveBal);
            setStableVal(ageBal);
            setErgVal(ergBal);
        }
    }, []);

    useEffect(() => {
        const id = setInterval(updateParams, 30000);
        updateParams();
        return () => {
            clearInterval(id);
        };
    }, [updateParams]);

    useTranslation();

    return (
        <>
            <Header />
            <main className="main-container">
                <section className="main-navigation">
                    <nav className="main-navigation__list">
                        <NavLink exact to="/">
                            <span>
                                <Trans i18nKey="menuDash" />
                            </span>
                        </NavLink>
                        <NavLink exact to="/stablecoin">
                            <span>
                                <Trans i18nKey="menuStableCoin" />
                            </span>
                        </NavLink>
                        <NavLink exact to="/reservecoin">
                            <span>
                                <Trans i18nKey="menuReserveCoin" />
                            </span>
                        </NavLink>
                    </nav>
                </section>
                <section className="finance-description">
                    <div className="finance-description__title">
                        <div className="finance-description__title_part1">The</div>
                        <div className="finance-description__title_part2">{usdName}</div>
                        <div className="finance-description__title_part3">Stablecoin</div>
                    </div>

                    <div className="finance-description__text">
                        <Trans i18nKey="financeDescriptionText1" components={{ br: <br /> }} />
                        <br />
                        <br />
                        <Trans i18nKey="financeDescriptionText2" />
                        <br />
                        <br />
                        <Trans i18nKey="financeDescriptionText3" />{' '}
                        <a
                            target="_blank"
                            href="https://ergoplatform.org/en/blog/2021-02-05-building-ergo-how-the-ageusd-stablecoin-works/"
                            rel="noreferrer noopener"
                        >
                            <Trans i18nKey="financeDescriptionAgeUSDProtocolText"/>
                        </a>
                    </div>
                </section>

                <CoinsInfo />
                <PersonalInfo ergVal={ergVal} stableVal={stableVal} reserveVal={reserveVal} />

                <footer className="footer mt-auto py-3">
                    <span className="text-muted">
                        <a href="https://ergoplatform.org/" target="_blank">
                            ergoplatform.org
                        </a>{' '}
                        <a>|</a>
                        <a href="https://sigmaverse.io/" target="_blank">
                            {' '}
                            sigmaverse.io
                        </a>{' '}
                        <a>|</a>
                        <a href="https://ergonaut.space/" target="_blank">
                            {' '}
                            ergonaut.space
                        </a>{' '}
                        <a>|</a>
                        <a href="https://github.com/anon-real/sigma-usd" target="_blank">
                            {' '}
                            github
                        </a>
                    </span>

                    <div className="switch-site-button">
                        <a href="https://old.sigmausd.io" rel="noopener noreferer">
                            <Trans i18nKey="viewSigmaUSDV1Text"/>
                        </a>
                    </div>
                </footer>
            </main>
        </>
    );
};

export default Home;
