export function S2S3Description({ description }: {description: string}) {
    return (
        <>
            <span className="deckcard-desc-bit">
                {description.split(' ')[0].substring(0, description.split(' ')[0].length - 1)}
                <span className="pop-units">
                    {description.split(' ')[0][description.split(' ')[0].length - 1]}
                </span>
                <i className="icon-male"></i>
            </span>
            <span className="deckcard-desc-bit">
                {description.split(' ')[2].substring(0, description.split(' ')[2].length - 1)}
                <span className="pop-units">
                    {description.split(' ')[2][description.split(' ')[2].length - 1]}
                </span>
                <i className="icon-industrial-building"></i>
            </span>
        </>
    )
}