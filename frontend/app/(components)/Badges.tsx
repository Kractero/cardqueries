import { badgesDict } from "../(helpers)/categories"

interface Props { cardBadges: { [key: string]: string; }, cardTrophies: string[] }

export function Badges({ cardBadges, cardTrophies }: Props) {
    return (
        <>
            <div id="wabadges">
                {Object.keys(cardBadges).includes('Condemned')
                    ?
                    <p className="wabadge">
                        <img src="https://www.nationstates.net/images/condemn.png" className="badge" alt="Condemnation badge" />
                    </p>
                    : Object.keys(cardBadges).includes('Commended') ?
                    <p className="wabadge">
                        <img src="https://www.nationstates.net/images/commend.png" className="badge" alt="Commendation badge" />
                    </p>
                    : ""
                }
            </div>
            <div className="specialbadges">
                {Object.keys(cardBadges).map((badge, i) => {
                    if (badge === 'Easter Egg') {
                        let repl = Object.values(cardBadges)[i]
                        if (Number(Object.values(cardBadges)[i]) >= 4) repl = String(4)
                        let badge_img = badgesDict[badge].replace('1', repl)
                        return (
                            <img alt={badge} key={badge} src={`https://www.nationstates.net/images/trophies/${badge_img}.png`}
                                className="trophy inline" title={`${badge}`} />
                        )
                    }
                    if (badgesDict[badge]) {
                        let badge_img = badgesDict[badge]
                        return (
                            <img alt={badge} key={badge} src={`https://www.nationstates.net/images/trophies/${badge_img}.png`}
                                className="trophy inline" title={`${badge}`} />
                        )
                    }
                }
                )}
            </div>
            <div id="trophycabinet">
                {cardTrophies.map((trophy, i) =>
                    <img key={trophy} src={`https://www.nationstates.net/images/trophies/${trophy.toLowerCase()}.png`} className="trophy inline"
                        alt={`${trophy.toLowerCase()} ranked ${cardTrophies[i]}`} />
                )}
            </div>
        </>
    )
}