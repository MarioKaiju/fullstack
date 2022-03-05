import React from "react"
import { connect } from "react-redux"

const Notification = (props) => {
  const message = props.notification || null
  if ( message === null)
    return null

  if ( message.error )
    return (
      <div className='error'>
        {message.message}
      </div>
    )

  if ( !props.message.error )
    return (
      <div className='message'>
        {message.message}
      </div>
    )
}

const mapStateToProps = (state) => {
  const notification = state.notification;
  return {
    notification
  }
}

export default connect(
  mapStateToProps,
)(Notification)