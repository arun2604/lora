import React from 'react'

function PageHeading(props: { heading: string }) {
    const { heading } = props
    return (
        <div style={{ fontSize: '34px' }}>
            {heading}
        </div>
    )
}

export default PageHeading
