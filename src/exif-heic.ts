/**
 * From https://github.com/exif-heic-js/exif-heic-js
 */
var debug = false

export type EXIF = Partial<FromExifTags & FromTiffTags & FromGPSTags & FromStrings>

type ValueType = string | number | number[] | undefined

type FromExifTags = { [key in ExifTagValue]: ValueType }
type FromTiffTags = { [key in TiffTagValue]: ValueType }
type FromGPSTags = { [key in GPSTagValue]: ValueType }
type FromStrings = {
  [K in StringKeys]: StringValues[K][keyof StringValues[K]]
}

const ExifTags = {
  // version tags
  0x9000: 'ExifVersion', // EXIF version
  0xa000: 'FlashpixVersion', // Flashpix format version

  // colorspace tags
  0xa001: 'ColorSpace', // Color space information tag

  // image configuration
  0xa002: 'PixelXDimension', // Valid width of meaningful image
  0xa003: 'PixelYDimension', // Valid height of meaningful image
  0x9101: 'ComponentsConfiguration', // Information about channels
  0x9102: 'CompressedBitsPerPixel', // Compressed bits per pixel

  // user information
  0x927c: 'MakerNote', // Any desired information written by the manufacturer
  0x9286: 'UserComment', // Comments by user

  // related file
  0xa004: 'RelatedSoundFile', // Name of related sound file

  // date and time
  0x9003: 'DateTimeOriginal', // Date and time when the original image was generated
  0x9004: 'DateTimeDigitized', // Date and time when the image was stored digitally
  0x9290: 'SubsecTime', // Fractions of seconds for DateTime
  0x9291: 'SubsecTimeOriginal', // Fractions of seconds for DateTimeOriginal
  0x9292: 'SubsecTimeDigitized', // Fractions of seconds for DateTimeDigitized

  // picture-taking conditions
  0x829a: 'ExposureTime', // Exposure time (in seconds)
  0x829d: 'FNumber', // F number
  0x8822: 'ExposureProgram', // Exposure program
  0x8824: 'SpectralSensitivity', // Spectral sensitivity
  0x8827: 'ISOSpeedRatings', // ISO speed rating
  0x8828: 'OECF', // Optoelectric conversion factor
  0x9201: 'ShutterSpeedValue', // Shutter speed
  0x9202: 'ApertureValue', // Lens aperture
  0x9203: 'BrightnessValue', // Value of brightness
  0x9204: 'ExposureBias', // Exposure bias
  0x9205: 'MaxApertureValue', // Smallest F number of lens
  0x9206: 'SubjectDistance', // Distance to subject in meters
  0x9207: 'MeteringMode', // Metering mode
  0x9208: 'LightSource', // Kind of light source
  0x9209: 'Flash', // Flash status
  0x9214: 'SubjectArea', // Location and area of main subject
  0x920a: 'FocalLength', // Focal length of the lens in mm
  0xa20b: 'FlashEnergy', // Strobe energy in BCPS
  0xa20c: 'SpatialFrequencyResponse', //
  0xa20e: 'FocalPlaneXResolution', // Number of pixels in width direction per FocalPlaneResolutionUnit
  0xa20f: 'FocalPlaneYResolution', // Number of pixels in height direction per FocalPlaneResolutionUnit
  0xa210: 'FocalPlaneResolutionUnit', // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
  0xa214: 'SubjectLocation', // Location of subject in image
  0xa215: 'ExposureIndex', // Exposure index selected on camera
  0xa217: 'SensingMethod', // Image sensor type
  0xa300: 'FileSource', // Image source (3 == DSC)
  0xa301: 'SceneType', // Scene type (1 == directly photographed)
  0xa302: 'CFAPattern', // Color filter array geometric pattern
  0xa401: 'CustomRendered', // Special processing
  0xa402: 'ExposureMode', // Exposure mode
  0xa403: 'WhiteBalance', // 1 = auto white balance, 2 = manual
  0xa404: 'DigitalZoomRation', // Digital zoom ratio
  0xa405: 'FocalLengthIn35mmFilm', // Equivalent foacl length assuming 35mm film camera (in mm)
  0xa406: 'SceneCaptureType', // Type of scene
  0xa407: 'GainControl', // Degree of overall image gain adjustment
  0xa408: 'Contrast', // Direction of contrast processing applied by camera
  0xa409: 'Saturation', // Direction of saturation processing applied by camera
  0xa40a: 'Sharpness', // Direction of sharpness processing applied by camera
  0xa40b: 'DeviceSettingDescription', //
  0xa40c: 'SubjectDistanceRange', // Distance to subject

  // other tags
  0xa005: 'InteroperabilityIFDPointer',
  0xa420: 'ImageUniqueID', // Identifier assigned uniquely to each image
} as const
type ExifTagsKey = keyof typeof ExifTags
type ExifTagValue = typeof ExifTags[ExifTagsKey]
function isExifTagsKey(key: number): key is ExifTagsKey {
  return key in Object.keys(ExifTags)
}
function isExifTagValue(value: any): value is ExifTagValue {
  return value in Object.values(ExifTags)
}

const TiffTags = {
  0x0100: 'ImageWidth',
  0x0101: 'ImageHeight',
  0x8769: 'ExifIFDPointer',
  0x8825: 'GPSInfoIFDPointer',
  0xa005: 'InteroperabilityIFDPointer',
  0x0102: 'BitsPerSample',
  0x0103: 'Compression',
  0x0106: 'PhotometricInterpretation',
  0x0112: 'Orientation',
  0x0115: 'SamplesPerPixel',
  0x011c: 'PlanarConfiguration',
  0x0212: 'YCbCrSubSampling',
  0x0213: 'YCbCrPositioning',
  0x011a: 'XResolution',
  0x011b: 'YResolution',
  0x0128: 'ResolutionUnit',
  0x0111: 'StripOffsets',
  0x0116: 'RowsPerStrip',
  0x0117: 'StripByteCounts',
  0x0201: 'JPEGInterchangeFormat',
  0x0202: 'JPEGInterchangeFormatLength',
  0x012d: 'TransferFunction',
  0x013e: 'WhitePoint',
  0x013f: 'PrimaryChromaticities',
  0x0211: 'YCbCrCoefficients',
  0x0214: 'ReferenceBlackWhite',
  0x0132: 'DateTime',
  0x010e: 'ImageDescription',
  0x010f: 'Make',
  0x0110: 'Model',
  0x0131: 'Software',
  0x013b: 'Artist',
  0x8298: 'Copyright',
} as const
type TiffTagKey = keyof typeof TiffTags
type TiffTagValue = typeof TiffTags[TiffTagKey]
function isTiffTagKey(key: number): key is TiffTagKey {
  return key in Object.keys(TiffTags)
}

const GPSTags = {
  0x0000: 'GPSVersionID',
  0x0001: 'GPSLatitudeRef',
  0x0002: 'GPSLatitude',
  0x0003: 'GPSLongitudeRef',
  0x0004: 'GPSLongitude',
  0x0005: 'GPSAltitudeRef',
  0x0006: 'GPSAltitude',
  0x0007: 'GPSTimeStamp',
  0x0008: 'GPSSatellites',
  0x0009: 'GPSStatus',
  0x000a: 'GPSMeasureMode',
  0x000b: 'GPSDOP',
  0x000c: 'GPSSpeedRef',
  0x000d: 'GPSSpeed',
  0x000e: 'GPSTrackRef',
  0x000f: 'GPSTrack',
  0x0010: 'GPSImgDirectionRef',
  0x0011: 'GPSImgDirection',
  0x0012: 'GPSMapDatum',
  0x0013: 'GPSDestLatitudeRef',
  0x0014: 'GPSDestLatitude',
  0x0015: 'GPSDestLongitudeRef',
  0x0016: 'GPSDestLongitude',
  0x0017: 'GPSDestBearingRef',
  0x0018: 'GPSDestBearing',
  0x0019: 'GPSDestDistanceRef',
  0x001a: 'GPSDestDistance',
  0x001b: 'GPSProcessingMethod',
  0x001c: 'GPSAreaInformation',
  0x001d: 'GPSDateStamp',
  0x001e: 'GPSDifferential',
} as const
type GPSTagsKey = keyof typeof GPSTags
type GPSTagValue = typeof GPSTags[GPSTagsKey]
function isGPSTagsKey(key: number): key is GPSTagsKey {
  return key in Object.keys(GPSTags)
}
function isGPSTagValue(value: any): value is GPSTagValue {
  return value in Object.values(GPSTags)
}

const StringValues = {
  ExposureProgram: {
    0: 'Not defined',
    1: 'Manual',
    2: 'Normal program',
    3: 'Aperture priority',
    4: 'Shutter priority',
    5: 'Creative program',
    6: 'Action program',
    7: 'Portrait mode',
    8: 'Landscape mode',
  },
  MeteringMode: {
    0: 'Unknown',
    1: 'Average',
    2: 'CenterWeightedAverage',
    3: 'Spot',
    4: 'MultiSpot',
    5: 'Pattern',
    6: 'Partial',
    255: 'Other',
  },
  LightSource: {
    0: 'Unknown',
    1: 'Daylight',
    2: 'Fluorescent',
    3: 'Tungsten (incandescent light)',
    4: 'Flash',
    9: 'Fine weather',
    10: 'Cloudy weather',
    11: 'Shade',
    12: 'Daylight fluorescent (D 5700 - 7100K)',
    13: 'Day white fluorescent (N 4600 - 5400K)',
    14: 'Cool white fluorescent (W 3900 - 4500K)',
    15: 'White fluorescent (WW 3200 - 3700K)',
    17: 'Standard light A',
    18: 'Standard light B',
    19: 'Standard light C',
    20: 'D55',
    21: 'D65',
    22: 'D75',
    23: 'D50',
    24: 'ISO studio tungsten',
    255: 'Other',
  },
  Flash: {
    0x0000: 'Flash did not fire',
    0x0001: 'Flash fired',
    0x0005: 'Strobe return light not detected',
    0x0007: 'Strobe return light detected',
    0x0009: 'Flash fired, compulsory flash mode',
    0x000d: 'Flash fired, compulsory flash mode, return light not detected',
    0x000f: 'Flash fired, compulsory flash mode, return light detected',
    0x0010: 'Flash did not fire, compulsory flash mode',
    0x0018: 'Flash did not fire, auto mode',
    0x0019: 'Flash fired, auto mode',
    0x001d: 'Flash fired, auto mode, return light not detected',
    0x001f: 'Flash fired, auto mode, return light detected',
    0x0020: 'No flash function',
    0x0041: 'Flash fired, red-eye reduction mode',
    0x0045: 'Flash fired, red-eye reduction mode, return light not detected',
    0x0047: 'Flash fired, red-eye reduction mode, return light detected',
    0x0049: 'Flash fired, compulsory flash mode, red-eye reduction mode',
    0x004d: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected',
    0x004f: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light detected',
    0x0059: 'Flash fired, auto mode, red-eye reduction mode',
    0x005d: 'Flash fired, auto mode, return light not detected, red-eye reduction mode',
    0x005f: 'Flash fired, auto mode, return light detected, red-eye reduction mode',
  },
  SensingMethod: {
    1: 'Not defined',
    2: 'One-chip color area sensor',
    3: 'Two-chip color area sensor',
    4: 'Three-chip color area sensor',
    5: 'Color sequential area sensor',
    7: 'Trilinear sensor',
    8: 'Color sequential linear sensor',
  },
  SceneCaptureType: {
    0: 'Standard',
    1: 'Landscape',
    2: 'Portrait',
    3: 'Night scene',
  },
  SceneType: {
    1: 'Directly photographed',
  },
  CustomRendered: {
    0: 'Normal process',
    1: 'Custom process',
  },
  WhiteBalance: {
    0: 'Auto white balance',
    1: 'Manual white balance',
  },
  GainControl: {
    0: 'None',
    1: 'Low gain up',
    2: 'High gain up',
    3: 'Low gain down',
    4: 'High gain down',
  },
  Contrast: {
    0: 'Normal',
    1: 'Soft',
    2: 'Hard',
  },
  Saturation: {
    0: 'Normal',
    1: 'Low saturation',
    2: 'High saturation',
  },
  Sharpness: {
    0: 'Normal',
    1: 'Soft',
    2: 'Hard',
  },
  SubjectDistanceRange: {
    0: 'Unknown',
    1: 'Macro',
    2: 'Close view',
    3: 'Distant view',
  },
  FileSource: {
    3: 'DSC',
  },

  Components: {
    0: '',
    1: 'Y',
    2: 'Cb',
    3: 'Cr',
    4: 'R',
    5: 'G',
    6: 'B',
  },
} as const
type StringValues = typeof StringValues
type StringKeys = keyof StringValues
type StringValuesKey = keyof typeof StringValues
function isStringValuesKey(key: string): key is StringValuesKey {
  return key in Object.keys(StringValues)
}

function readExifTags(file: DataView, tiffStart: number, dirStart: number, bigEnd: boolean) {
  const entries = file.getUint16(dirStart, !bigEnd)
  // const tags: Partial<{ [key in ExifTagValue]: number }> = {}
  const tags: Partial<{ [key in ExifTagValue]: number | number[] }> = {}

  for (let i = 0; i < entries; i++) {
    const entryOffset = dirStart + i * 12 + 2
    const offset = file.getUint16(entryOffset, !bigEnd)
    if (isExifTagsKey(offset)) {
      const tag = ExifTags[offset]
      if (!tag && debug) console.log('Unknown tag: ' + file.getUint16(entryOffset, !bigEnd))
      if (tag && isExifTagValue(tag)) {
        const value = readTagValue(file, entryOffset, tiffStart, bigEnd)
        if (isNumber(value) || (Array.isArray(value) && value.every((v) => isNumber(v)))) {
          tags[tag] = value
        }
      }
    }
  }
  return tags
}

function readTIFFTags(file: DataView, tiffStart: number, dirStart: number, bigEnd: boolean) {
  const entries = file.getUint16(dirStart, !bigEnd)
  const tags: Partial<{ [key in TiffTagValue]: ValueType }> = {}
  // const tags = {}

  for (let i = 0; i < entries; i++) {
    const entryOffset = dirStart + i * 12 + 2
    const offset = file.getUint16(entryOffset, !bigEnd)
    if (isTiffTagKey(offset)) {
      const tag = TiffTags[offset]
      if (!tag && debug) console.log('Unknown tag: ' + file.getUint16(entryOffset, !bigEnd))
      if (tag) {
        tags[tag] = readTagValue(file, entryOffset, tiffStart, bigEnd)
      }
    }
  }
  return tags
}

function readGPSTags(file: DataView, tiffStart: number, dirStart: number, bigEnd: boolean) {
  const entries = file.getUint16(dirStart, !bigEnd)
  const tags: Partial<{ [key in GPSTagValue]: ValueType }> = {}
  // const tags = {}

  for (let i = 0; i < entries; i++) {
    const entryOffset = dirStart + i * 12 + 2
    const offset = file.getUint16(entryOffset, !bigEnd)
    if (isGPSTagsKey(offset)) {
      const tag = GPSTags[offset]
      if (!tag && debug) console.log('Unknown tag: ' + file.getUint16(entryOffset, !bigEnd))
      if (tag && isGPSTagValue(tag)) {
        tags[tag] = readTagValue(file, entryOffset, tiffStart, bigEnd)
      }
    }
  }
  return tags
}

function isNumber(nbr: any): nbr is number {
  return Number.isInteger(nbr)
}

function readTagValue(file: DataView, entryOffset: number, tiffStart: number, bigEnd: boolean): ValueType {
  const type = file.getUint16(entryOffset + 2, !bigEnd)
  const numValues = file.getUint32(entryOffset + 4, !bigEnd)
  const valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart

  switch (type) {
    case 1: // byte, 8-bit unsigned int
    case 7: // undefined, 8-bit byte, value depending on field
      if (numValues == 1) {
        return file.getUint8(entryOffset + 8)
      } else {
        const offset = numValues > 4 ? valueOffset : entryOffset + 8
        const vals = []
        for (let n = 0; n < numValues; n++) {
          vals[n] = file.getUint8(offset + n)
        }
        return vals
      }

    case 2: // ascii, 8-bit byte
      const offset = numValues > 4 ? valueOffset : entryOffset + 8
      return getStringFromDB(file, offset, numValues - 1)

    case 3: // short, 16 bit int
      if (numValues == 1) {
        return file.getUint16(entryOffset + 8, !bigEnd)
      } else {
        const offset = numValues > 2 ? valueOffset : entryOffset + 8
        const vals = []
        for (let n = 0; n < numValues; n++) {
          vals[n] = file.getUint16(offset + 2 * n, !bigEnd)
        }
        return vals
      }

    case 4: // long, 32 bit int
      if (numValues == 1) {
        return file.getUint32(entryOffset + 8, !bigEnd)
      } else {
        const vals = []
        for (let n = 0; n < numValues; n++) {
          vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd)
        }
        return vals
      }

    case 5: // rational = two long values, first is numerator, second is denominator
      if (numValues == 1) {
        const numerator = file.getUint32(valueOffset, !bigEnd)
        const denominator = file.getUint32(valueOffset + 4, !bigEnd)
        return Number(numerator / denominator)
      } else {
        const vals = []
        for (let n = 0; n < numValues; n++) {
          const numerator = file.getUint32(valueOffset + 8 * n, !bigEnd)
          const denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd)
          vals[n] = Number(numerator / denominator)
        }
        return vals
      }

    case 9: // slong, 32 bit signed int
      if (numValues == 1) {
        return file.getInt32(entryOffset + 8, !bigEnd)
      } else {
        const vals = []
        for (let n = 0; n < numValues; n++) {
          vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd)
        }
        return vals
      }

    case 10: // signed rational, two slongs, first is numerator, second is denominator
      if (numValues == 1) {
        return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset + 4, !bigEnd)
      } else {
        const vals = []
        for (let n = 0; n < numValues; n++) {
          vals[n] = file.getInt32(valueOffset + 8 * n, !bigEnd) / file.getInt32(valueOffset + 4 + 8 * n, !bigEnd)
        }
        return vals
      }
  }
}

function getStringFromDB(buffer: DataView, start: number, length: number) {
  let outstr = ''
  for (let n = start; n < start + length; n++) {
    outstr += String.fromCharCode(buffer.getUint8(n))
  }
  return outstr
}

function readEXIFData(file: DataView, start: number): EXIF | undefined {
  let bigEnd: boolean
  // test for TIFF validity and endianness
  if (file.getUint16(start) == 0x4949) {
    bigEnd = false
  } else if (file.getUint16(start) == 0x4d4d) {
    bigEnd = true
  } else {
    if (debug) console.log('Not valid TIFF data! (no 0x4949 or 0x4D4D)')
    return
  }

  if (file.getUint16(start + 2, !bigEnd) != 0x002a) {
    if (debug) console.log('Not valid TIFF data! (no 0x002A)')
    return
  }

  const firstIFDOffset = file.getUint32(start + 4, !bigEnd)

  if (firstIFDOffset < 0x00000008) {
    return
  }

  // TIFF
  const tiffData = readTIFFTags(file, start, start + firstIFDOffset, bigEnd)

  const exifData: Partial<{ [key in ExifTagValue]: ValueType }> = {}
  const exifIFDPointer = tiffData.ExifIFDPointer
  if (exifIFDPointer && isNumber(exifIFDPointer)) {
    const exifTags = readExifTags(file, start, start + exifIFDPointer, bigEnd)
    for (const tag in exifTags) {
      switch (tag) {
        case 'LightSource':
        case 'Flash':
        case 'MeteringMode':
        case 'ExposureProgram':
        case 'SensingMethod':
        case 'SceneCaptureType':
        case 'SceneType':
        case 'CustomRendered':
        case 'WhiteBalance':
        case 'GainControl':
        case 'Contrast':
        case 'Saturation':
        case 'Sharpness':
        case 'SubjectDistanceRange':
        case 'FileSource': {
          const exifTag = exifTags[tag]
          if (isNumber(exifTag)) {
            exifData[tag] = StringValues[tag][exifTag]
          }
          break
        }
        case 'ExifVersion':
        case 'FlashpixVersion': {
          const exifTag = exifTags[tag]
          if (Array.isArray(exifTag) && exifTag.length > 3) {
            exifData[tag] = String.fromCharCode(exifTag[0], exifTag[1], exifTag[2], exifTag[3])
          }
          break
        }

        case 'ComponentsConfiguration': {
          const exifTag = exifTags[tag]
          if (Array.isArray(exifTag) && exifTag.length > 3) {
            exifData[tag] =
              StringValues.Components[exifTag[0]] +
              StringValues.Components[exifTag[1]] +
              StringValues.Components[exifTag[2]] +
              StringValues.Components[exifTag[3]]
          }
          break
        }
        default:
          // TOFIX
          exifData[tag] = exifTags[tag]
      }
    }
  }

  const gpsData: Partial<{ [key in GPSTagValue]: ValueType }> = {}
  const gpsInfoIFDPointer = tiffData.GPSInfoIFDPointer
  if (gpsInfoIFDPointer && isNumber(gpsInfoIFDPointer)) {
    const gpsTags = readGPSTags(file, start, start + gpsInfoIFDPointer, bigEnd)
    for (const tag in gpsTags) {
      switch (tag) {
        case 'GPSVersionID':
          const gpsTag = gpsTags[tag]
          if (Array.isArray(gpsTag) && gpsTag.length > 3) {
            gpsData[tag] = gpsTag[0] + '.' + gpsTag[1] + '.' + gpsTag[2] + '.' + gpsTag[3]
          }
          break
        default:
          gpsData[tag] = gpsTags[tag]
      }
    }
  }

  return { ...tiffData, ...exifData, ...gpsData }
}

//Based on HEIC format decoded via https://github.com/exiftool/exiftool
export const findEXIFinHEIC = (data: ArrayBufferLike): EXIF | undefined => {
  var dataView = new DataView(data)
  var ftypeSize = dataView.getUint32(0) // size of ftype box
  var metadataSize = dataView.getUint32(ftypeSize) //size of metadata box

  //Scan through metadata until we find (a) Exif, (b) iloc
  let exifOffset = -1
  var ilocOffset = -1
  for (var i = ftypeSize; i < metadataSize + ftypeSize; i++) {
    if (getStringFromDB(dataView, i, 4) == 'Exif') {
      exifOffset = i
    } else if (getStringFromDB(dataView, i, 4) == 'iloc') {
      ilocOffset = i
    }
  }

  if (exifOffset == -1 || ilocOffset == -1) {
    return
  }

  var exifItemIndex = dataView.getUint16(exifOffset - 4)

  //Scan through ilocs to find exif item location
  for (let i = ilocOffset + 12; i < metadataSize + ftypeSize; i += 16) {
    var itemIndex = dataView.getUint16(i)
    if (itemIndex == exifItemIndex) {
      var exifLocation = dataView.getUint32(i + 8)
      dataView.getUint32(i + 12)
      //Check prefix at exif exifOffset
      var prefixSize = 4 + dataView.getUint32(exifLocation)
      exifOffset = exifLocation + prefixSize

      return readEXIFData(dataView, exifOffset)
    }
  }

  return
}

//Based on Exif.js (https://github.com/exif-js/exif-js)
export const findEXIFinJPEG = (data: ArrayBufferLike): EXIF | undefined => {
  const dataView = new DataView(data)
  if (dataView.getUint8(0) != 0xff || dataView.getUint8(1) != 0xd8) {
    if (debug) console.log('Not a valid JPEG')
    return // not a valid jpeg
  }
  let offset: number = 2
  let marker: number
  const length = data.byteLength
  while (offset < length) {
    if (dataView.getUint8(offset) != 0xff) {
      if (debug) console.log('Not a valid marker at offset ' + offset + ', found: ' + dataView.getUint8(offset))
      return // not a valid marker, something is wrong
    }
    marker = dataView.getUint8(offset + 1)
    if (debug) console.log(marker)
    // we could implement handling for other markers here,
    // but we're only looking for 0xFFE1 for EXIF data
    if (marker == 225) {
      if (debug) console.log('Found 0xFFE1 marker')
      return readEXIFData(dataView, offset + 4 + 6)
    }
    offset += 2 + dataView.getUint16(offset + 2)
  }
}
