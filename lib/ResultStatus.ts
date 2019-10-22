type ResultStatus =
  /** The ATT command or request successfully completed. */
  | 'success'
  /** The attribute handle is invalid on this peripheral. */
  | 'invalidHandle'
  /** The permissions prohibit reading the attribute’s value. */
  | 'readNotPermitted'
  /** The permissions prohibit writing the attribute’s value. */
  | 'writeNotPermitted'
  /** The attribute Protocol Data Unit (PDU) is invalid. */
  | 'invalidPdu'
  /** Reading or writing the attribute’s value failed for lack of authentication. */
  | 'insufficientAuthentication'
  /** The attribute server doesn’t support the request received from the client. */
  | 'requestNotSupported'
  /** The specified offset value was past the end of the attribute’s value. */
  | 'invalidOffset'
  /** Reading or writing the attribute’s value failed for lack of authorization. */
  | 'insufficientAuthorization'
  /** The prepare queue is full, as a result of there being too many write requests in the queue. */
  | 'prepareQueueFull'
  /** The attribute wasn’t found within the specified attribute handle range. */
  | 'attributeNotFound'
  /** The ATT read blob request can’t read or write the attribute. */
  | 'attributeNotLong'
  /** The encryption key size used for encrypting this link is insufficient. */
  | 'insufficientEncryptionKeySize'
  /** The length of the attribute’s value is invalid for the intended operation. */
  | 'invalidAttributeValueLength'
  /** The ATT request encountered an unlikely error and wasn’t completed. */
  | 'unlikelyError'
  /** Reading or writing the attribute’s value failed for lack of encryption. */
  | 'insufficientEncryption'
  /** The attribute type isn’t a supported grouping attribute as defined by a higher-layer specification. */
  | 'unsupportedGroupType'
  /** Resources are insufficient to complete the ATT request. */
  | 'insufficientResources'

export default ResultStatus
