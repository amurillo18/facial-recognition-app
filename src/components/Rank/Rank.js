import React from 'react';



const Rank = ({name, entries}) => {
	return(
		<div> 
			<div className='black fw9 f3'>
				{`${name}, your current rank is`}
			</div>
			<div className='black fw9 f1'>
				{entries}
			</div>
		</div>
	);	
}

export default Rank;