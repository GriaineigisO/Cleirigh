import '../style.css';

const Welcome = () => {

    return (
        <div id="welcomePage">

            <div id="intro-message">
                <h1>Preserve Your Research</h1>
                <h2>Cleirigh helps you create a reliable archive for your cherised geneological research</h2>
            </div>

            <div className="fact-box">
                <h3>Let Your Research Live Beyond You</h3>
                <p>Nothing digital lasts forever. With Cleirigh, your research is automatically converted to printable PDFs, allowing you to create physical copies of your geneological research. No longer will your research be at the mercy of some company's server. No need to toil with the tedious task of converting your digitially collected research into printable forms. Cleirigh does that for you. Cleirigh lets your research exist in your own hands, literally.</p>
            </div>

            <div className="fact-box">
                <h3>Print Your Tree</h3>
                <p>When your family tree has hundreds or even thousands of people in it, the thought of creating a physical copy of that tree becomes daunting, not to say extremely time consuming. Cleirigh automatically produces printable family tree charts using the data provided by you. No need to fret about formatting and the daunting task of figuring out how to neatly orginise the numerous printed trees.</p>
            </div>

            <div className="fact-box">
                <h3>Advanced Browsing</h3>
                <p>You can find ancestors in your tree not only by searching their name, but also based on a wide variety of information. Want a list of all ancestors born in a certain place? All ancestors born within a timeframe? A combination of the two and more?</p>
            </div>
    
        </div>
    )
};

export default Welcome;