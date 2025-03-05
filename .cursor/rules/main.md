# Api docs

This API is a work in progress. It will include APIs for the devigger and sportsbooks' odds.

Devigger API URL:
http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open
The Devigger API is not officially released but you can play around with it if you'd like.

Devigger API Schema:
&LegOdds = The Text in the LegOdds Textbox
&FinalOdds = The Text in the FinalOdds Textbox
&Correlation*Bool = 0 or 1
&Correlation_Text = The Text in the Correlation Textbox
&Boost_Bool = 0 or 1
&Boost_Text = The Text in the Boost Textbox
&Boost_Type = 0=profit, 1=all
&DevigMethod = 0=multi, 1=additive, 2=power, 3=shin, 4=worstcase,5=weightedaverage, 6=showall
Note: "Show All" is not currently enabled for the API. It will be available in the future.
&WorstCase_Multiplicative = 0 or 1
&WorstCase_Additive = 0 or 1
&WorstCase_Power = 0 or 1
&WorstCase_Shin = 0 or 1
&WeightedAverage_Multiplicative = The Text in the WeightedAverage_Multiplicative Textbox
&WeightedAverage_Additive = The Text in the WeightedAverage_Additive Textbox
&WeightedAverage_Power = The Text in the WeightedAverage_Power Textbox
&WeightedAverage_Shin = The Text in the WeightedAverage_ShinTextbox
&Args = To include additional outputs, add these, separated by a ",":
ev_p = EV%
ev_d = EV Dollar (Full Units)
fb_p = Free Bet %
fo_o = FinalOdds in AmericanOdds format
url = URL to the devig (Same as the "View/Edit Devig" button on the Devigger)
kelly = returns the Full Kelly Units. You can then calculate the kelly wager by using this formula: Kelly Wager = FullKellyUnits/100 * BankRoll \_ KellyMultiplier

dm = returns devig method(s) used. The values returned and their meanings:
"DevigMethod": "m" //Multiplicative
"DevigMethod": "a" //Additive
"DevigMethod": "p" //Power
"DevigMethod": "s" //Shin
"DevigMethod": "wc:p" //Worst-case (power method)
"DevigMethod": "wc:p,m" //Worst-case (Power and Multiplicative methods, such as a parlay with a long leg and a short leg)
"DevigMethod": "wa:m=0.4,a=0,p=0.1,s=0.5" //Weighted Average (Multiplicative at 40%, Power at 10% and Shin at 50%)

Example:
&Args=ev_p,fb_p,fo_o,kelly,dm,ev_d,url

A rough (pre-release) Google Sheet implementation is available here.

You can also use the above in the normal devigger to autofill the devigger page. Here are the differences:
"?api=1" is ignored
"?autofill=1" enables autofill and the detection of the other parameters
"&Args=" is ignored
"&DevigMethod" is ignored, as well as any URL parameter that would change the user's settings.
